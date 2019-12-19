import { Injectable, Inject } from "@angular/core";
import { Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { UserServiceFirebase } from '../UserService/user.service';
import { FirebaseUserModel } from '../../../../models/providers/firebase/user.model';

import { ItemModel } from '../../../../models/item.model';
import { NodeModel } from '../../../../models/node.model';

import { Library } from '../../../../app.library';
import { Definitions } from '../../../../app.definitions';

@Injectable()
export class DatabaseServiceFirebase {

  private itemsCollection: AngularFirestoreCollection;
  items: Observable<Object[]>;
  itemModel: ItemModel = new ItemModel();
  nodeModel: NodeModel = new NodeModel();
  user: FirebaseUserModel = new FirebaseUserModel();
  collection:string;
  root:any;
  def:any;
  modelPosRef:any;
  constructor(private db: AngularFirestore, private userService: UserServiceFirebase, private lib: Library){
    this.def = Definitions;
  }



 async ini(collection){
     this.db.collection(collection).ref.orderBy('orderid')
     this.itemsCollection = this.db.collection(collection, ref => ref.orderBy('orderid'));
     this.collection = collection;
     this.root = this.itemsCollection;
     this.modelPosRef = this.itemModel.item;
     await this.userService.authenticate();
     this.user = this.userService.user;
     console.log(this.user);
     return this.itemsCollection
           .snapshotChanges()
           .pipe(
             map((actions) => {
               return actions.filter(a => a.payload.doc.data().uid === this.user.uid).map(a =>{
                 const data = a.payload.doc.data();
                 const id = a.payload.doc.id;
                 return {id, ...data}
               });
             })
      );
 }

 async select(item, _t:any){
   //modelPosRef will be default to 'projects' model[this.collection]
   //each time we traverse, modelPosRef is updated.
   //use this.root.ref to get parentreference - this will determine whether we are in collection or document
   //if we are in collection, listDocuments
   //if we are in document, listCollections (returns array of collections, using model structure and modelPosRef)
   let root  = this.root.ref;
   //if parent is null, we are at the start so begin with default collection otherwise use next item id
   let nextid = root.parent === null ? this.collection : item.id;
   if(!this.lib.isDefined(this.modelPosRef[nextid])) return false; // we are at the end
   this.modelPosRef = this.modelPosRef[nextid];
   let itms:any;
   if(root.parent === null || root.constructor.name === 'CollectionReference'){
     itms = await this.listCollections(item);
   } else{
     itms = await this.listDocuments(item);
   }
   itms.subscribe(itm =>{
     _t.items = of(itm.data);
     _t.type = itm.type;
     _t.layout = itm.layout;
   });
 }

 async listCollections(item){
   //use modelPosRef and model structure
   //if property isCollection exists and is true, push to collections array
   //return observable array of collections
   //you could also append property to data - 'grid' to show as grid rather than list
   console.log(item);
   this.root = this.root.doc(item.id);
   let cols = [];
   Object.keys(this.modelPosRef).forEach(r=>{
     if(this.lib.isProperty(this.modelPosRef[r],'params')){
       if(this.lib.isProperty(this.modelPosRef[r].params,'isCollection')){
         cols.push({ "id": r, "fields":{"name":{"value":r}} });
       }
     }
   });
   let res = { "data":cols, "type":"collections", "layout": "grid" }
   console.log(res);
   return of(res);
 }

 async listDocuments(item:any = false){
   //make sure reference is in collection -- this.root.collection(item.name).ref;
   //then perform get function and return list of documents as observable
   if(item !== false) this.root = this.root.collection(item.id);
   let docs = [];
   return await this.root.ref.orderBy('orderid').get().then(querySnapshot =>{
      querySnapshot.forEach(function(doc) {
          const docName = doc.data().name && doc.data().name !== '' ? doc.data().name : doc.id;
          docs.push(doc.data());
      });
      let res = { "data":docs, "type":"documents", "layout": "list" }
      console.log(res);
      return of(res);
   });
 }

 async set(data,items,isNew){
   console.log(data);
   if(this.user.authorised){
     let root = this.root.doc(data.id ? data.id : this.db.createId());
     data.id = root.ref.id;
     data.uid = this.user.uid;
     root.set(data);
     root.update({ date_updated: firebase.firestore.FieldValue.serverTimestamp() });
     if(isNew){
       root.update({ date_created: firebase.firestore.FieldValue.serverTimestamp() });
       this.create(root); //if new not update, create structure
     }
   }
 }

 //setup structure for new item, import structure from json
 //and format it for firebase
 create(dd,it:any = false){
   console.log('creating new item');
   let batch = this.db.firestore.batch();
   if(!it) it = this.itemModel.item[this.collection];
   //console.log(it);
   Object.keys(it).forEach((key)=>{
     let docName = Object.keys(it[key])[0];
     let docId = this.db.createId();

     //for each document use the node Model structure
     let docData = this.lib.deepCopy(this.nodeModel.node);
     docData.fields = it[key][docName];
     console.log(docData);
     docData.fields.name.value = docName;
     docData.id = docId

     let docData2 = {};
     //the idea is to create a document with the data
     Object.keys(docData).forEach(d => {
       //console.log(d);
       //if neither a collection or document, append data and do timestamp if field is 'date_created'
       if(this.checkData(docData[d])){
         docData2[d] = d === 'date_created' ? firebase.firestore.FieldValue.serverTimestamp() : docData[d];
       }
     });
     //queue batch
     const ref = dd.collection(key).doc(docId).ref;
     batch.set(ref,docData2);

     //once added document, loop through properties
     //if object found, then create subcollection
     let dd2 = dd.collection(key).doc(docId);
     Object.keys(docData).forEach(d=>{
       console.log(d);
      if(this.checkData(docData[d]) === 'collection'){
        console.log('creating collection');
        let sd = Object.keys(docData[d])[0];
        let nit = {[d] : docData[d]};
        this.create(dd2,nit);
      }

      if(d === 'fields'){
         //loop through and check if fields contain collections
         Object.keys(docData[d]).forEach(f=>{
            if(this.checkData(docData[d][f]) === 'collection'){
              let nit2 = {[f] : docData[d][f]};
              console.log(nit2);
              this.create(dd2,nit2);
            }
          });
        }

     });

   });
   //commit batch write after loop
   batch.commit().then(function () {
     console.log('batch write complete');
   });
 }

orderIds(items){
  items.subscribe((items:any) => {
    let batch = this.db.firestore.batch();
    items.forEach((item,i) =>{
      const ref = this.root.doc(item.id).ref;
      batch.update(ref,{'orderid': i});
    });
    batch.commit();
  });
 }

 checkData(obj){
   //if object has paramters property and isCollection property
   let r:any = true;
   console.log(this.lib.isProperty(obj, 'params'));
   if(this.lib.isProperty(obj,'params')){
     console.log('has params');
     if(this.lib.isProperty(obj.params,'isCollection')){
       r = obj.params.isCollection ? 'collection' : 'document';
     }
   }
   return r;
 }

 duplicate(item,items){
   console.log(item);
   item.id = this.db.createId();
   item.date_created = firebase.firestore.FieldValue.serverTimestamp();
   item.date_updated = firebase.firestore.FieldValue.serverTimestamp();
   this.set(item,items,true);
 }

 async refresh(_t){
   let itms = await this.listDocuments(false);
   _t.items = of(itms.value.data);
 }

 delete(items,index,item){
   if(this.user.authorised){
     this.root.doc(item.id).delete();
   }
 }

 //this uses a cloud function to delete documents and subscollections within.
 async deleteRecursive(items,index,item){
   const ref =this.root.doc(item.id).ref;
   const path = ref.path;
   if(this.user.authorised){
    var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
    await deleteFn({ path: path })
        .then(function(result) {
            console.log('Delete success: ' + JSON.stringify(result));
        })
        .catch(function(err) {
            //logMessage('Delete failed, see console,');
            console.warn(err);
        });
    }
 }

 checkUniqueFields(item,items){
   items.subscribe(itms =>{
     console.log(itms.length);
     console.log(this.collection);
     Object.keys(this.def[this.collection]).forEach(key =>{
       if(this.def[this.collection][key].unique){
         item.fields[key].value = item.fields[key].value.split('__')[0] + '__'+itms.length;
       }
     });
   });
 }


}
