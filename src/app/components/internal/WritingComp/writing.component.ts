import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

import { Router, ActivatedRoute } from '@angular/router';

import {MarkupWritingComponent} from './markup/markup.writing.component';
import {GroupsWritingComponent} from './groups/groups.writing.component';
import {GroupsWritingModalComponent} from './groups/groups.modal/groups.writing.modal.component';

import { ItemModel } from '../../../models/item.model';

@Component({
  selector: 'comp-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss'],
  providers: [MarkupWritingComponent],
  encapsulation: ViewEncapsulation.None
})
export class WritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();
  itemModel: ItemModel = new ItemModel();

  section: string = 'markup';
  id:number;

  master:any = {
    groups: {
      's' : [{ "id": 0, "orderid": 0, "date_created": "", "date_updated": "", "fields": { "name": { "value": "Custom 1", "type": "text" }, "desc": { "value": "", "type": "text" }, "Prop": { "key": "Prop", "value": "11", "type": "custom", "type_options": [], "unique": false } }, "nest": [], "params": {} } ],
      'c': [],
      'p': []
    },
    markup: { 0 : [] },
    newvalues: {},
    newvalue: '',
    heading: {
      key: "s",
      value: this.lib.deepCopy(this.itemModel.document),
      type: "string"
    },
    body: {
      key: "body",
      value: this.lib.deepCopy(this.itemModel.document),
      type: "textarea"
    },
    character: {
      key: "c",
      value: this.lib.deepCopy(this.itemModel.document),
      type: "string"
    },
    parenthetical:{
      key: "p",
      value: this.lib.deepCopy(this.itemModel.document),
      type: "string"
    },
    dialogue:{
      key: "dialogue",
      value: this.lib.deepCopy(this.itemModel.document),
      type: "textarea"
    },
    templates_preset:{
      's':[],
      'c':[],
      'p':[]
    },
    templates_custom:{
      's':[],
      'c':[],
      'p':[]    
    }
  }

  private el: HTMLInputElement;

  constructor(private lib: Library, private service: CoreService, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(
        params =>{
          const id = params['id'];
        }
    );
  }

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {
    console.log('writing component');
  }

  /* Specific component functions */
  changeSection(e){
    console.log(e);
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
export { MarkupWritingComponent, GroupsWritingComponent, GroupsWritingModalComponent }
