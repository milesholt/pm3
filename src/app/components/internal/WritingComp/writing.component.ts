import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

import {MarkupWritingComponent} from './markup/markup.writing.component';
import {ItemsWritingComponent} from './items/items.writing.component';
import {GroupsWritingComponent} from './groups/groups.writing.component';

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

  section: string = 'markup';
  // groups:any = {
  //   'scene' : [],
  //   'character':[]
  // };
  // markup:any = [];
  // newvalues:any = {};
  // newvalue:string = '';
  // heading:any = {
  //   key: "scene",
  //   value:"",
  //   type:"string"
  // };
  // body:any = {
  //   key: "body",
  //   value:"",
  //   type:"textarea"
  // };
  // character:any = {
  //   key: "character",
  //   value:"",
  //   type:"string"
  // };
  // parenthetical:any = {
  //   key: "parenthetical",
  //   value:"",
  //   type:"string"
  // };
  // dialogue:any = {
  //   key: "dialogue",
  //   value:"",
  //   type:"textarea"
  // };

  master:any = {
    groups: {
      'scene' : [],
      'character':[]
    },
    markup: [],
    newvalues: {},
    newvalue: '',
    heading: {
      key: "scene",
      value:"",
      type:"string"
    },
    body: {
      key: "body",
      value:"",
      type:"textarea"
    },
    character: {
      key: "character",
      value:"",
      type:"string"
    },
    parenthetical:{
      key: "parenthetical",
      value:"",
      type:"string"
    },
    dialogue:{
      key: "dialogue",
      value:"",
      type:"textarea"
    }
  }

  private el: HTMLInputElement;

  constructor(private lib: Library, private service: CoreService) {}

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {}

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
export { MarkupWritingComponent, GroupsWritingComponent, ItemsWritingComponent }
