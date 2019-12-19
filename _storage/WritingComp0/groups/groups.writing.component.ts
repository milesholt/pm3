import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { MasterService } from '../../../../services/master.service';

//import { FormComponent } from '../../../core/FormComp/form.component';
import { GroupsWritingModalComponent } from './groups.modal/groups.writing.modal.component';


@Component({
  selector: 'comp-writing-groups',
  templateUrl: './groups.writing.component.html',
  styleUrls: ['./groups.writing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[MasterService]
})
export class GroupsWritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Input() master: any = {};
  @Output() callback = new EventEmitter();
  group: string = 's'
  groups:any;
  _items:any;
  comp:any;
  params:any = {};

  constructor(private lib: Library, private service: MasterService) {}

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {
    setTimeout(()=>{
      this.params.groups = this.items;
      this.params.templates_preset = this.master.templates_preset;
      this.params.templates_custom = this.master.templates_custom;
      this._items = this.items[this.group];
    },);
    this.comp = GroupsWritingModalComponent;
  }

  /* Specific component functions */

  changeGroup(e){
    this._items = this.items[e];
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
}
