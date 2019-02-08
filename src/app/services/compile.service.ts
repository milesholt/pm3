import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../app.definitions';
import { Library } from '../app.library';
import { Platform } from '@ionic/angular';

import { NodeModel } from '../models/node.model';
import { FieldModel } from '../models/field.model';


@Injectable()
export class CompileService {

  items; auth; user; notification; notificationExt; toast;
  nodeModel: NodeModel = new NodeModel();
  fieldModel: FieldModel = new FieldModel();

  constructor(
    public lib: Library
  ){
  }


  // prepareData(pri,sec){
  //   console.log(sec);
  //   let obj = {};
  //   Object.keys(pri).forEach(field => {
  //     console.log(field);
  //     if(sec.hasOwnProperty(field)) obj[field] = this.lib.deepCopy(pri[field]);
  //     if(Object.keys(sec).includes(field)) obj[field].value = sec[field];
  //   });
  //   console.log(obj);
  //   return obj;
  // }

  //compile data back to server friendly structure { key : value }
  // compileData(data:any = false){
  //   if(!data) return;
  //   let obj = {};
  //   Object.keys(data).forEach(field => {
  //     obj[field] =  this.lib.deepCopy(data[field].value);
  //   });
  //   return obj;
  // }


  prepareData(definitions,fields,item){
    console.log(fields);
    let node =  this.lib.deepCopy(this.nodeModel.node);
    if(!!item){
      node.id = item.id;
      node.orderid = item.orderid;
    }
    Object.keys(fields).forEach((field, i) => {
      Object.keys(definitions).forEach(def => {
        if(field == def){
          node.fields.push(this.lib.deepCopy(this.fieldModel.field));
          node.fields[i].key = field;
          node.fields[i].value = fields[field].value;
          node.fields[i].type = fields[field].type;
          node.fields[i].type_options = fields[field].type_options ? fields[field].type_options : [];
          node.fields[i].label =  definitions[def].label;
        }
      });

      if(fields[field].type == 'custom') node.fields.push(fields[field]);
    });
    console.log(node);
    return node;
  }

  compileData(node:any = false, fields){
    if(!node) return;
    console.log(fields);
    node.fields.forEach((field, i) => {
      Object.keys(fields).forEach((key) => {
        if(key == field.key) fields[key].value = field.value
      });
      if(field.type == 'custom') fields[field.key] = this.lib.deepCopy(field);
    });
    node.fields = fields;
    console.log(node);
    return node;
  }

}
