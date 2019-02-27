import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../../app.library';
import { CoreService } from '../../../../../services/core.service';

import { FormComponent } from '../../../../core/FormComp/form.component';
import { ItemModel } from '../../../../../models/item.model';

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'comp-writing-groups-modal',
  templateUrl: './groups.writing.modal.component.html',
  styleUrls: ['./groups.writing.modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[CoreService]
})
export class GroupsWritingModalComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Input() public params: any;
  @Input() _t: any;
  @Input() fields:any;
  @Output() callback = new EventEmitter();
  group: string = 's'
  groups:any = [];
  template: any;
  templates_preset:any = [];
  templates_custom:any = [];
  _items:any;
  itemModel: ItemModel = new ItemModel();
  comp:any;
  custom:boolean = false;
  step:number = 1;
  def:any;
  model:string = 'document';


  constructor(private lib: Library, private service: CoreService) {
    //this.groups = this._t.groups;
    this.def = service.getDefinitions();
  }

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {
    this.group = this._t.collection;
    this.templates_preset = this._t.params.templates_preset;
    this.templates_custom = this._t.params.templates_custom;
    this.groups = this._t.params.groups;
    this.comp = FormComponent;
  }

  /* Specific component functions */

  async selectTemplate(item){
    this.template = item;
    let itemNode = this.lib.deepCopy(this.itemModel[this.model]);
    let data = await this.service.compile.prepareData(this.def[this.group], item.fields, item);
    this.fields = data.fields;
    this._t.params.modalData.fields = this.fields;
    this.step = 2;
  }

  selectGroup(group){
    this.group = group;
    this.step = 1;
  }

  /* Key internal component functions */

  //Do function handles action and data before emitting to callback
  do(item,action){
    let params = [item,action];
    this.emit(params);
  }

  //Emit requested data back to Item Component
  emit(params){
    this.callback.emit(params);
  }

  //Handle callback to component
  handleCallback(e){
    console.log(e);
  }
}
