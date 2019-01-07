import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService, ModalService } from '../../../services/core.service';
import { of } from 'rxjs';

@Component({
  selector: 'comp-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [CoreService, ModalService, Library]
})
export class ItemComponent implements OnInit, OnChanges {

  @Input() collection: string;
  @Input() user: any;
  items: Observable<Object[]>;
  item: Observable<Object[]>;
  //items:any;
  def:any;
  nestindex:number = -1;
  isAsync:boolean = true;
  type:string = 'collections';
  layout:string = 'list';
  comp:string;

  constructor(private service: CoreService, private lib: Library){
    this.def = service.getDefinitions();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.user.authorised){
      console.log('user has been authorised.');
      this.items = this.service.db.ini(this.collection);
    }
  }

  async setItem(item:any = {}){
    const isNew : boolean = this.lib.isEmpty(item) ? true : false;
    const params = isNew ? this.def.item : this.lib.prepareData(this.def[this.collection],(item.data ? item.data : item));
    const res:any = await this.service.modal.openModal(params);
    if(res.data) this.service.db.set(this.lib.compileData(res.data),item);
    this.refreshItems();
  }

  async refreshItems(){
    let itms = await this.service.db.listDocuments(false);
    console.log(itms);
    this.items = of(itms.value.data);
  }

  async deleteItem(item){
    const id = item.id;
    this.service.db.delete(id);
    this.refreshItems();
  }

  async enterItem(item){
    this.nestindex++;
    this.item =  item;
    let itms = await this.service.db.select(item);
    this.items = of(itms.value.data);
    this.type = itms.value.type;
    this.layout = itms.value.layout;
    if(this.type == 'documents') this.comp = item.name;
  }

  handleCallback(event){
    let action = event[1];
    let item = event[0];
    console.log(action);
    switch(action){
      case 'enter': this.enterItem(item); break;
      case 'edit': this.setItem(item); break;
      case 'delete': this.deleteItem(item); break;
    }
  }

}
