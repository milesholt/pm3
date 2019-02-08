import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';

import { Library } from '../../../app.library';

import { ItemModel } from '../../../models/item.model';

@Injectable()
export class ItemsService {
  itemModel: ItemModel = new ItemModel();

  constructor(private lib: Library) {
  }

  ini(collection){
    console.log(collection);
  }

  delete(items:any,idx:number,item:any){
    this.lib.delete(idx,items);
  }

  duplicate(item, items){
    items.push(this.lib.deepCopy(item));
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
    items = this.lib.deepCopy(items);
  }

  refresh(_t){
    _t.items = this.lib.deepCopy(_t.items);
  }

  select(){

  }

}
