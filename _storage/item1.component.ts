import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter, IterableDiffers, DoCheck } from '@angular/core';
import { Observable, BehaviorSubject, of, from, Subject, isObservable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService, ModalService } from '../../../services/core.service';
import { ItemModel } from '../../../models/item.model';

@Component({
  selector: 'comp-item2',
  templateUrl: './item2.component.html',
  styleUrls: ['./item2.component.scss'],
  providers: [CoreService, ModalService, Library]
})
export class ItemComponent2 implements OnInit, OnChanges, DoCheck {

  @Input() collection: any;
  @Input() connection: any = [];
  @Input() user: any = {};
  @Input() model: string = "";
  @Output() callback = new EventEmitter();
  @Input() items: any = [];
  itemslength: number = 0;
  item: Observable<Object[]>;
  itemModel: ItemModel = new ItemModel();
  def:any;
  type:string = 'collections';
  layout:string = 'list';
  differ: any;

  constructor(private service: CoreService, private lib: Library, differs: IterableDiffers){
    this.def = service.getDefinitions();
    this.differ = differs.find([]).create(null);
  }

  async ngOnInit() {
    //set connection to service
    await this.setConnection(this.connection);
    //initiate items if none
    if(!this.items) {
      this.items = await this.service.items.ini(this.collection);
    }
    //watch length of items if obsersable
    if(isObservable(this.items)) this.items.subscribe((r:any) => { this.itemslength = r.length })

  }

  ngAfterViewInit(){}

  ngOnChanges(changes: SimpleChanges) {}

  ngDoCheck(){
    //if not observable watch here and get length if change
    if(!isObservable(this.items) && this.items !== false){
      const itemchange = this.differ.diff(this.items);
      if(itemchange !== null) this.itemslength = itemchange.length;
    }
  }

  fetchItems(){
    return isObservable(this.items) ? this.items : of(this.items);
  }

  async setConnection(connection){
    await this.service.connectTo(connection,'items');
  }

  async setItem(data:any = this.lib.deepCopy(this.itemModel[this.model]), isNew : boolean = true){
    let fields = isNew ? data : data.fields;
    let item = isNew ? false : data;
    const params = this.service.compile.prepareData(this.def[this.collection], fields, item);
    const res:any = await this.service.modal.openModal(params);
    await this.formatItemIds(res.data,isNew);
    item = this.service.compile.compileData(res.data, fields);
    if(res.data) this.service.items.set(item,this.items,isNew);
  }

  async duplicateItem(item){
    let newitem = this.lib.deepCopy(item);
    await this.formatItemIds(newitem,true);
    this.service.items.duplicate(newitem, this.items);
  }

  async deleteItem(idx,item){
    this.service.items.delete(this.items,idx,item);
    this.orderItems();
  }

  async enterItem(item){
  }

  async formatItemIds(item,isNew:boolean=false){
    if(isNew) item.orderid = this.itemslength > 0 ? this.itemslength : item.orderid;
    item.id = this.itemslength > 0 && !isObservable(this.items) ? this.getNewId() : item.id;
  }

  async orderItems(){
    this.service.items.orderIds(this.items);
  }

  getNewId(){
    let ids =  this.items.map(item => item.id);
    const maxid = Math.max(...ids);
    return (maxid+1);
  }

}
