import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController,ModalController } from '@ionic/angular';
import { Library } from '../../../app.library';
import { Definitions } from '../../../app.definitions';

import { FieldModel } from '../../../models/field.model';

@Component({
  selector: 'comp-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [Library]
})
export class FormComponent implements OnInit {
  //fields:any = [];
  newfield:any = {'label': 'Enter property label', 'key': '', 'value':'', 'type': 'text'}
  newfield_types:any = ['text','textarea'];
  selectfield:any;
  fieldModel : FieldModel = new FieldModel();
  editfield:boolean = false;
  tmp_newfield:any;
  @Input() public fields: any;
  @Input() _t: any;
  @Output() public fieldsChange:EventEmitter<any> = new EventEmitter();

  constructor(private modalCtrl:ModalController, private lib: Library) {
  }

  ngOnInit() {
    //console.log(this.params);
    this.ini();
  }

  ini(){
    console.log(this.fields);
    //this.fields = !this.lib.isArray(this.params) ? Object.keys(this.params).map(field => this.params[field]) : this.params;
  }

  add(){
    console.log(this.fieldModel.field);
    this.fields.push(this.lib.deepCopy(this.fieldModel.field));
    this.updateIds();
    this.selectfield = this.fields[this.fields.length-1];
    this.editfield = true;
  }

  edit(idx){
    this.selectfield = this.fields[idx];
    this.editfield = true;
  }

  duplicate(idx){
    this.fields.push(this.lib.deepCopy(this.fields[idx]));
    this.updateIds();
  }

  delete(idx){
    this.lib.delete(idx,this.fields);
  }

  done(){
    this.editfield = false;
    this.fieldsChange.emit(this.fields);
  }

  updateIds(){
  //   console.log(this.params);
  //   if(this.fields.length > 1){
  //     let ids = [] = this.fields.map(field => this.params[field].id);
  //     const maxid = Math.max(...ids);
  //     const lastfield = this.params[this.fields[this.fields.length-1]];
  //     if(ids.includes(lastfield.id)) lastfield.id = (maxid+1);
  //   }
  }

  // addField(){
  //   this.selectfield = this.lib.deepCopy(this.field);
  //   this.selectfield.id = Object.keys(this.params).length;
  //   this.params[this.selectfield.key] = this.selectfield;
  //   this.editfield = true;
  // }
  //
  // updateIds(){
  //   if(this.fields.length > 1){
  //     let ids = [] = this.fields.map(field => this.params[field].id);
  //     const maxid = Math.max(...ids);
  //     const lastfield = this.params[this.fields[this.fields.length-1]];
  //     if(ids.includes(lastfield.id)) lastfield.id = (maxid+1);
  //   }
  // }

  deleteField(idx,field){
    delete this.fields[field];
  }

}
