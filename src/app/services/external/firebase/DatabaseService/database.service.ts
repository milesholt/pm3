import { Injectable, Inject } from "@angular/core";
import { Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { UserServiceFirebase } from '../UserService/user.service';
import { FirebaseUserModel } from '../../../../models/providers/firebase/user.model';

import { ItemModel } from '../../../../models/item.model';

import { Library } from '../../../../app.library';

@Injectable()
export class DatabaseServiceFirebase {

  private itemsCollection: AngularFirestoreCollection;
  items: Observable<Object[]>;
  itemModel: ItemModel = new ItemModel();
  user: FirebaseUserModel = new FirebaseUserModel();
  collection:string;
  root:any;
  modelPosRef:any;
  constructor(private db: AngularFirestore, private userService: UserServiceFirebase, private lib: Library){
  }

 async ini(collection){
     this.itemsCollection = this.db.collection(collection);
     this.collection = collection;
     this.root = this.itemsCollection;
     this.modelPosRef = this.itemModel.item;
     await this.userService.authenticate();
     this.user = this.userService.user;
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

 async select(item){
   //modelPosRef will be default to 'projects' model[this.collection]
   //each time we traverse, modelPosRef is updated.
   //use this.root.ref to get parentreference - this will determine whether we are in collection or document
   //if we are in collection, listDocuments
   //if we are in document, listCollections (returns array of collections, using model structure and modelPosRef)
   let root  = this.root.ref;
   this.modelPosRef = this.modelPosRef[(root.parent === null ? this.collection : item.id)];
   if(root.parent === null || root.constructor.name === 'CollectionReference'){
     console.log(root.constructor.name);
     return this.listCollections(item);
   } else{
     return this.listDocuments(item);
   }
 }

 async listCollections(item){
   //use modelPosRef and model structure
   //if property isCollection exists and is true, push to collections array
   //return observable array of collections
   //you could also append property to data - 'grid' to show as grid rather than list
   console.log('here');
   console.log(item);
   this.root = this.root.doc(item.id);
   let cols = [];
   Object.keys(this.modelPosRef).forEach(r=>{
     if(this.lib.isProperty(this.modelPosRef[r],'params')){
       if(this.lib.isProperty(this.modelPosRef[r].params,'isCollection')){
         cols.push({"id":r, "name":r});
       }
     }
   });
   let res = { "data":cols, "type":"collections", "layout": "grid" }
   return of(res);
 }

 async listDocuments(item:any = false){
   //make sure reference is in collection -- this.root.collection(item.name).ref;
   //then perform get function and return list of documents as observable
   if(item !== false) this.root = this.root.collection(item.id);
   let docs = [];
   return await this.root.ref.get().then(querySnapshot =>{
      querySnapshot.forEach(function(doc) {
          const docName = doc.data().name && doc.data().name !== '' ? doc.data().name : doc.id;
          docs.push({"id":doc.id, "name": docName, "data":doc.data()});
      });
      let res = { "data":docs, "type":"documents", "layout": "list" }
      console.log(res);
      return of(res);
   });
 }

 set(data,item){
   if(this.user.authorised){
     let root = this.root.doc(item.id ? item.id : this.db.createId());
     data.uid = this.user.uid;
     root.set(data);
     root.update({ date_updated: firebase.firestore.FieldValue.serverTimestamp() });
     if(!item.id) this.create(root); //if new not update, create structure
   }
 }

 //setup structure for new item, import structure from json
 //and format it for firebase
 create(dd,it:any = false){
   let batch = this.db.firestore.batch();
   if(!it) it = this.itemModel.item[this.collection];
   console.log(it);
   Object.keys(it).forEach((key)=>{
     let docName = Object.keys(it[key])[0];
     let docData = it[key][docName];
     let docData2 = {};
     //the idea is to create a document with the data
     //but if the data property is an object, create a subcollection
     //remove any object properties from data for document
     Object.keys(docData).forEach(d => {
       if(!this.lib.isObject(docData[d])){
         docData2[d] = d === 'date_created' ? firebase.firestore.FieldValue.serverTimestamp() : docData[d];
       }
     });
     //queue batch
     const ref = dd.collection(key).doc(docName).ref;
     batch.set(ref,docData2);
     //once added document, loop through properties
     //if object found, then create subcollection
     let dd2 = dd.collection(key).doc(docName);
     Object.keys(docData).forEach(d=>{
      if(this.lib.isObject(docData[d])){
        let sd = Object.keys(docData[d])[0];
        let nit = {[d] : docData[d]};
        this.create(dd2,nit);
      }
     });
   });
   //commit batch write after loop
   batch.commit().then(function () {
     console.log('batch write complete');
   });
 }

 delete(id){
   if(this.user.authorised){
     console.log('deleting');
     this.root.doc(id).delete();
   }
 }

}
