import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService, ModalService } from '../../../services/core.service';
import { of } from 'rxjs';

import { ItemModel } from '../../../models/item.model';

@Component({
  selector: 'comp-item2',
  templateUrl: './item2.component.html',
  styleUrls: ['./item2.component.scss'],
  providers: [CoreService, ModalService, Library]
})
export class ItemComponent2 implements OnInit, OnChanges {

  @Input() collection: any;
  @Input() connection: any = [];
  @Input() user: any = {};
  @Input() model: string = "";
  @Output() callback = new EventEmitter();
  @Input() items: any = false;
  item: Observable<Object[]>;
  itemModel: ItemModel = new ItemModel();
  //items:any;
  def:any;
  nestindex:number = -1;
  type:string = 'collections';
  layout:string = 'list';

  constructor(private service: CoreService, private lib: Library){
    this.def = service.getDefinitions();
  }

  async ngOnInit() {
    console.log(this.collection);
    //set connection to service
    await this.setConnection(this.connection);
    //initiate items if none
    if(!this.items) {
      this.items = await this.service.items.ini(this.collection);
    }
  }

  ngAfterViewInit(){}

  ngOnChanges(changes: SimpleChanges) {
  }

  async setConnection(connection){
    await this.service.connectTo(connection,'items');
  }

  async addItem(){
    this.items.push(this.lib.deepCopy(this.itemModel[this.model]));
  }

  async setItem(item:any = this.lib.deepCopy(this.itemModel[this.model]), isNew : boolean = true){
    console.log(item);
    const params = this.lib.prepareData(this.def[this.collection], item);
    const res:any = await this.service.modal.openModal(params);
    if(res.data) this.service.items.set(this.lib.compileData(res.data),item,this.items,isNew);
    this.refreshItems(isNew);
  }

  async duplicateItem(item){
    this.items.push(this.lib.deepCopy(item));
    this.refreshItems(true);
  }

  async refreshItems(isNew:boolean = false){
    this.updateOrderIds();
    if(isNew) this.updateIds();
  }

  async deleteItem(idx){
    this.service.items.delete(this.items,idx);
    this.refreshItems();
  }

  async enterItem(item){
  }

  updateOrderIds(){
    this.items.forEach((item,i) => {
      item.orderid = i;
    });
  }

  updateIds(){
    //build an array of all the ids
    //find the highest id
    //loop through items, if matching id, take highest id and increment
    if(this.items.length > 1){
      let ids =  this.items.map(item => item.id);
      const maxid = Math.max(...ids);
      let newid = parseInt(this.items[this.items.length-1].id);
      if(ids.includes(newid)) this.items[this.items.length-1].id = (maxid+1);
    }
  }

  handleCallback(event){
    let action = event[1];
    let item = event[0];
    switch(action){
      case 'enter': this.enterItem(item); break;
      case 'edit': this.setItem(item); break;
      case 'delete': this.deleteItem(item); break;
    }
  }

}
