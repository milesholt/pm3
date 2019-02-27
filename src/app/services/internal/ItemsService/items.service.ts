import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';

import { Library } from '../../../app.library';
import { ItemModel } from '../../../models/item.model';
import { Definitions } from '../../../app.definitions';

@Injectable()
export class ItemsService {
  itemModel: ItemModel = new ItemModel();
  def:any;
  collection:string;

  constructor(private lib: Library) {
    this.def = Definitions;
  }

  ini(collection){
    this.collection = collection;
    return [];
  }

  delete(items:any,idx:number,item:any){
    this.lib.delete(idx,items);
  }

  duplicate(item, items){
    //items.push(this.lib.deepCopy(item));
    items.push(item);
  }

  set(item,items,isNew){
    //if new, create new item
    if(isNew) this.create(item,items);
  }

  create(item,items){
    console.log(items);
    items.push(item);
    console.log(items);
  }

  orderIds(items){
    items.forEach((item,i) => {
      item.orderid = i;
    });
    console.log(items);
    //items = this.lib.deepCopy(items);
  }

  formatItemIds(item,isNew:boolean=false,items:any = []){
    if(isNew) item.orderid = items.length;
    //let id = item.id;
    //console.log(id);
    item.id = items.length > 0 ? isNew === true ? this.getNewId(items) : item.id : 0;
    // if(items.length > 0){
    //   if(isNew){
    //     id = this.getNewId(items)
    //   }
    // } else{
    //   id = 0;
    // }
    // item.id = id;
  }

  getNewId(items){
    let ids = items.map(item => item.id);
    const maxid = Math.max(...ids) !== -Infinity ? Math.max(...ids) : -1;
    return (maxid+1);
  }

  checkUniqueFields(item,items){
    console.log(this.collection);
    Object.keys(this.def[this.collection]).forEach(key =>{
      if(this.def[this.collection][key].unique){
        item.fields[key].value = item.fields[key].value.split('__')[0] + '__'+items.length;
      }
    });
  }

  refresh(_t){
    _t.items = this.lib.deepCopy(_t.items);
  }

  select(){

  }

}
