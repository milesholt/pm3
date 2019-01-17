import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService, ModalService } from '../../../services/core.service';
import { of } from 'rxjs';

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
  @Output() callback = new EventEmitter();
  @Input() items: any = false;
  item: Observable<Object[]>;
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
    console.log('here');
    console.log(this.collection);
  }

  async setConnection(connection){
    await this.service.connectTo(connection,'items');
  }

  async setItem(item:any = {}){
    const isNew : boolean = this.lib.isEmpty(item) ? true : false;
    const params = isNew ? this.def.item : this.lib.prepareData(this.def[this.collection],(item.data ? item.data : item));
    const res:any = await this.service.modal.openModal(params);
    if(res.data) this.service.items.set(this.lib.compileData(res.data),item);
    this.refreshItems();
  }

  async refreshItems(){
  }

  async deleteItem(item){
    const id = item.id;
    this.service.items.delete(id);
    this.refreshItems();
  }

  async enterItem(item){
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
