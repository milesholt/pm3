import { Injectable, Inject } from "@angular/core";
import { Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';

import { UserService } from './user.service';
import { FirebaseUserModel } from '../../../models/providers/firebase/user.model';

import { ItemModel } from '../../../models/item.model';

import {Library } from '../../../app.library';

@Injectable()
export class DatabaseService {

  private itemsCollection: AngularFirestoreCollection;
  items: Observable<Object[]>;
  item: ItemModel = new ItemModel();
  user: FirebaseUserModel = new FirebaseUserModel();
  collection:string;
  //lib: Library;
  constructor(private db: AngularFirestore, private userService: UserService, private lib: Library){
    this.authenticate();
  }

 ini(collection){
     this.itemsCollection = this.db.collection(collection);
     this.collection = collection;
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

 set(data,item){
   if(this.user.authorised){
     const doc = this.itemsCollection.doc(item.id ? item.id : this.db.createId());
     data.uid = this.user.uid;
     doc.set(data);
     doc.update({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
     if(!item.id) this.create(doc); //if new not update, create structure
   }
 }

 create(doc,it:any = false,s:string = ""){
   //setup structure for new item, import structure from json
   //and format it for firebase
   if(!it) it = this.item[this.collection];
   console.log(it);
   let i = 0;
   Object.keys(it).forEach((key)=>{
     s = 'doc.collection("'+key+'")';
     if(this.lib.isObject(it[key])){
       //document
       let docName = Object.keys(it[key])[0];
       let docData = it[key][docName];
       s += '.doc(docName).set(it[key][docName])';
       //s += '.doc("'+docName+'").set({})';
       //if we are setting structure in document
       //this.create(doc,it[key],s);
     }
     i++;
     console.log(s);
     eval(s);

     //once added document, loop through properties
     //if object found, create subcollection
     s = 'doc.collection("'+key+'").doc(docName)';
     Object.keys(docData).forEach(d=>{
      if(this.lib.isObject(docData[d])){
        let sd = Object.keys(docData[d])[0];
        s += '.collection(d).doc(sd).set(docData[d][sd])';
        eval(s);
      }
     });
   });
    //doc.collection("subcollection1").doc('test1').collection("subcollection2").doc('test3').collection('subcollection3').add({});
    //doc.collection("tasks").doc("task").set({});
    //doc.collection("ideas").doc("idea").set({});
    //doc.collection("research").doc("board").set({});
    //doc.collection("calendar").doc("event").set({});
 }

 create1(doc,it:any = false,s:string = ""){
   //setup structure for new item, import structure from json
   //and format it for firebase
   if(!it) it = this.item[this.collection];
   let i = 0;


   Object.keys(it).forEach((key)=>{
     s = 'doc.collection("'+key+'")';
     let docName = Object.keys(it[key])[0];
     let docData = it[key][docName];
     let docData2 = {};

     //the idea is to create a document with the data
     //but if the data property is an object, create a subcollection

     //remove any objects from data for document
     Object.keys(docData).forEach(d => {
       if(!this.lib.isObject(docData[d])){
         docData2[d] = docData[d];
       }
     });
     s += '.doc(docName).set(docData2)';
     i++;
     eval(s);

     //once added document, loop through properties
     //if object found, then create subcollection
     s = 'doc.collection("'+key+'").doc(docName)';
     Object.keys(docData).forEach(d=>{
      if(this.lib.isObject(docData[d])){
        let sd = Object.keys(docData[d])[0];
        s += '.collection(d).doc(sd).set(docData[d][sd])';
        eval(s);
      }
     });
   });
 }

 create2(doc,it:any = false,s:string = ""){
   //setup structure for new item, import structure from json
   //and format it for firebase
   if(!it) it = this.item[this.collection];
   let i = 0;
   Object.keys(it).forEach((key)=>{
     console.log(key);
     s = 'doc.collection("'+key+'")';
     let docName = Object.keys(it[key])[0];
     let docData = it[key][docName];
     let docData2 = {};

     //the idea is to create a document with the data
     //but if the data property is an object, create a subcollection
     //remove any objects from data for document
     Object.keys(docData).forEach(d => {
       if(!this.lib.isObject(docData[d])){
         docData2[d] = docData[d];
       }
     });
     s += '.doc(docName).set(docData2)';
     i++;
     eval(s);

     //once added document, loop through properties
     //if object found, then create subcollection
     let doc2 = doc.collection(key).doc(docName);
     Object.keys(docData).forEach(d=>{
      if(this.lib.isObject(docData[d])){
        let sd = Object.keys(docData[d])[0];
        let nit = {[d] : docData[d]};
        this.create(doc2,nit,s);
      }
     });
   });
 }

 delete(id){
   if(this.user.authorised){
     this.itemsCollection.doc(id).delete();
   }
 }

 authenticate(){
   this.userService.getCurrentUser().then(user => {
     this.user = user;
     return true;
   }, err => console.log(err));
 }

}
