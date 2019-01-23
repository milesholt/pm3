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

  delete(items:any,idx:number){
    this.lib.delete(idx,items);
  }

  set(data,item,items,isNew){
    //update item by merging new values to matching keys
    //if new, create new item
    this.lib.mergeObjs(item,data);
    if(isNew) this.create(item,items);
  }

  create(item,items){
    items.push(item);
  }

  list(){

  }

}
