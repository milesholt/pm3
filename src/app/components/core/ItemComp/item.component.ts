import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, IterableDiffers, DoCheck } from '@angular/core';
import { Observable, BehaviorSubject, of, from, Subject, isObservable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService, ModalService } from '../../../services/core.service';
import { ItemModel } from '../../../models/item.model';

import {CdkDragDrop, moveItemInArray, CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';

@Component({
  selector: 'comp-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [CoreService, ModalService, Library]
})
export class ItemComponent implements OnInit, OnChanges, DoCheck {

  @Input() collection: any;
  @Input() connection: any = [];
  @Input() user: any = {};
  @Input() model: string = "";
  @Input() items: any = false;
  @Input() comp:any = false;
  @Input() params:any = {};

  @Output() callback = new EventEmitter();

  itemslength: number = 0;
  item: Observable<Object[]>;
  itemModel: ItemModel = new ItemModel();
  def:any;
  type:string = 'collections';
  layout:string = 'list';
  differ: any;
  nestindex:number = -1;
  orderitems:boolean = false;
  isNew:boolean = true;

  constructor(private service: CoreService, private lib: Library, differs: IterableDiffers){
    this.def = service.getDefinitions();
    this.differ = differs.find([]).create(null);
  }

  async ngOnInit() {
    //set connection to service
    await this.setConnection(this.connection);
    //initiate items if none
    if(!this.items) this.items = await this.service.items.ini(this.collection);
  }

  ngAfterViewInit(){}

  ngOnChanges(changes: SimpleChanges) {}

  ngDoCheck(){
    //watch items and do updates here if any changes
    if(this.items !== false){
      if(!isObservable(this.items)){
        const change = this.differ.diff(this.items);
        if(change !== null) this.changedItemsUpdates(change);
      } else {
        this.items.subscribe((change:any) => { this.changedItemsUpdates(change) });
      }
    }
  }

  fetchItems(){
    return isObservable(this.items) ? this.items : of(this.items);
  }

  changedItemsUpdates(items){
    this.itemslength = items.length;
  }

  async setConnection(connection){
    await this.service.connectTo(connection,'items');
  }

  async setItem(data:any = this.lib.deepCopy(this.itemModel[this.model]), isNew : boolean = true){
    this.item = data;
    this.isNew = isNew;
    let fields = isNew ? data : data.fields;
    let item = isNew ? false : data;
    this.params.modalData = this.service.compile.prepareData(this.def[this.collection], fields, item);
    const res:any = await this.service.modal.openModal(this,this.comp);
    if(!res.data.modalData) return false;
    await this.formatItemIds(res.data.modalData,isNew);
    item = this.service.compile.compileData(res.data.modalData, fields);
    if(res.data) this.service.items.set(item,this.items,isNew);
  }

  async selectItem(item){
    this.nestindex++;
    this.item = item;
    this.callback.emit(item);
    await this.service.items.select(item, this);

  }

  async duplicateItem(item){
    let newitem = this.lib.deepCopy(item);
    await this.service.items.checkUniqueFields(newitem, this.items);
    await this.formatItemIds(newitem,true);
    await this.service.items.duplicate(newitem, this.items);
  }

  async deleteItem(idx,item){
    await this.service.items.delete(this.items,idx,item);
    await this.orderItems();
  }

  async formatItemIds(item,isNew:boolean=false){
    if(isNew) item.orderid = this.itemslength;
    item.id = !isObservable(this.items) ? this.getNewId() : item.id;
  }

  async orderItems(){
    await this.service.items.orderIds(this.items);
  }

  getNewId(){
    let ids =  this.items.map(item => item.id);
    const maxid = Math.max(...ids);
    return (maxid+1);
  }

  async dragItem(event: CdkDragDrop<string[]>) {
    if(isObservable(this.items)){
      let itms = await this.service.items.listDocuments(false);
      this.items = of(itms.value.data);
      await this.items.subscribe((items:any)=>{
        moveItemInArray(items, event.previousIndex, event.currentIndex);
        this.orderItems();
      });
    }else{
      moveItemInArray(this.items, event.previousIndex, event.currentIndex);
      this.orderItems();
    }
  }

  handleCallback(e){
    console.log(e);
  }

}
