import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {ModalComponent} from '../ModalComp/modal.component';

import * as firebase from 'firebase';



export interface Item { name: string; }

@Component({
  selector: 'comp-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [AngularFirestore]
})
export class ItemComponent implements OnInit {

  @Input() collection: string;

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  res:any;

  constructor(private modalCtrl:ModalController, private db: AngularFirestore){}

  ngOnInit() {
    this.itemsCollection = this.db.collection(this.collection);
    //this.items = this.itemsCollection.valueChanges();
    this.items = this.itemsCollection
        .snapshotChanges()
        .pipe(
          map((actions) => {
            return actions.map(a =>{
              const data = a.payload.doc.data() as Item;
              const id = a.payload.doc.id;
              return {id, ...data}
            });

          })
        );
  }

  async addItem() {
    const id = this.db.createId();
    let params = { "params": {"name": ""}};
    const r = await this.openModal(params);
    console.log(this.res);
    const name = this.res.name;
    const item: Item = { name };
    const doc = this.itemsCollection.doc(id);
    doc.set(item);
    doc.update({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
  }

  async editItem(itm){
    let params = { "params": {"name": itm.name}};
    await this.openModal(params);
    const id = itm.id;
    const name = this.res.name;
    const item: Item = { name };
    const doc = this.itemsCollection.doc(id);
    doc.set(item);
    doc.update({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
  }

  async setItem(i:any = {}){
    let params = { "params": {"name": i.name ? i.name : ""}};
    await this.openModal(params);
    console.log(this.res);
    const doc = this.itemsCollection.doc(i.id ? i.id : this.db.createId());
    doc.set(this.res);
    doc.update({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
  }

  async deleteItem(itm){
    const id = itm.id;
    this.itemsCollection.doc(id).delete();
  }

  async openModal(params)
  {
    const modal = await this.modalCtrl.create({
     component: ModalComponent,
     componentProps: params
   });
   await modal.present();
   await modal.onDidDismiss().then((r) => {
     this.res = r.data;
     //return await new Promise(resolve => r.data);
   });
  }

}
