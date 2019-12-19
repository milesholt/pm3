import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController,ModalController } from '@ionic/angular';
import { Library } from '../../../app.library';
import { Definitions } from '../../../app.definitions';
import { Observable, BehaviorSubject, of, from, Subject, isObservable } from 'rxjs';
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
  isUniqueValue:boolean = true;

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
    this.fields.push(this.lib.deepCopy(this.fieldModel.field));
    this.selectfield = this.fields[this.fields.length-1];
    this.editfield = true;
  }

  edit(idx){
    this.selectfield = this.fields[idx];
    this.editfield = true;
  }

  duplicate(idx){
    this.fields.push(this.lib.deepCopy(this.fields[idx]));
  }

  delete(idx){
    this.lib.delete(idx,this.fields);
  }

  done(){
    this.editfield = false;
    this.fieldsChange.emit(this.fields);
  }

  deleteField(idx,field){
    delete this.fields[field];
  }

  handleFieldChange(){
    this.isUniqueValue = true;
    //if we are comparing values against item model
    if(this.lib.isDefined(this._t.items)){
      if(isObservable(this._t.items)){ 
        this._t.items.subscribe(items=>{
          items.forEach(item=>{
            if(item.fields[this.selectfield.key].value === this.selectfield.value && this.selectfield.unique) this.isUniqueValue = false;
          });
        });
      }else{
        this._t.items.forEach(item=>{
          if(this.lib.isDefined(item.fields[this.selectfield.key])){
            if(item.fields[this.selectfield.key].value === this.selectfield.value && this.selectfield.unique) this.isUniqueValue = false;
          }
        });
      }
    }
    if(this.isUniqueValue) this.fieldsChange.emit(this.fields);
  }

}
