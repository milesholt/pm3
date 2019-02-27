import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { NodeModel } from '../../../../models/node.model';


@Component({
  selector: 'comp-writing-markup',
  templateUrl: './markup.writing.component.html',
  styleUrls: ['./markup.writing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkupWritingComponent implements OnInit, OnChanges {

  @Input() master: any = {};
  @Output() callback = new EventEmitter();

  private el: HTMLInputElement;
  private nodeModel: NodeModel = new NodeModel();
  input:string;
  draft:number = 0;
  markup:any;

  constructor(private lib: Library, private service: CoreService) {}

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    this.markup = this.master.markup[this.draft];
  }

  /* Specific component functions */

  createElement(el:string){
    let nel = this.lib.deepCopy(this.master[el]);
    nel.id = this.service.items.getNewId(this.markup);
    this.markup.push(nel);
  }

  updateGroups(){
    Object.keys(this.master.groups).forEach(group=>{
      //let g = this.master.groups[group] = [];
      let g = this.master.groups[group];
      let vals = [];
      Object.keys(this.master.markup).forEach(draft=>{
        this.master.markup[draft].forEach(el =>{
          if(el.key == group){

            // let newitem = this.lib.deepCopy(this.nodeModel.node);
            // newitem.fields = el.value;
            // const isNew = !this.lib.isProperty(el,'gid') ? true : false;
            // this.service.items.formatItemIds(newitem,isNew,g);
            // if(!isNew){
            //   newitem.id = el.gid;
            // } else {
            //   el.gid = newitem.id;
            // }
            // // g.length === 0 ? g.push(newitem) : g.map(itm => itm.fields.name.value).indexOf(el.value.name.value) === -1 ? g.push(newitem) : null;
            // console.log(el);
            // g.length === 0 ? g.push(newitem) : g.filter(itm => itm.id == el.gid).length === 0 ? g.push(newitem) : null;


            let item = this.lib.deepCopy(this.nodeModel.node);
            item.fields = el.value;
            const isNew = !this.lib.isProperty(el,'gid') || g.map(itm => itm.fields.name.value).indexOf(el.value.name.value) === -1 ? true : false;
            console.log(isNew);
            this.service.items.formatItemIds(item,isNew,g);
            if(isNew){ el.gid = item.id; g.push(item); }

          }
        });
      });
    });
  }

  updateElement(el,idx,val,elpath){
    //const v = (val !== '' || el.type !== 'text') ? val : eval('el.' + elpath);
    const v = val !== '' ? val : eval('el.' + elpath);
    eval('el.' + elpath + ' = v');
    this.input = v;
    setTimeout(()=>{
      if(Object.keys(this.master.groups).includes(el.key)) this.updateGroups();
    },2000);
  }

  test(e){
    console.log(e);
  }

  editElement(action,el,idx){
    switch(action){
      case 'copy': this.markup.push(this.lib.deepCopy(el)); break;
      case 'delete': this.lib.delete(idx,this.markup); break;
    }
  }

  dragElement(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.markup, event.previousIndex, event.currentIndex);
  }

  newDraft(){
    let draft = this.lib.deepCopy(this.markup);
    let nidx = Object.keys(this.master.markup).length;
    this.master.markup[nidx] = draft;
    this.selectDraft(nidx)
  }

  selectDraft(idx){
    this.draft = idx;
    this.markup = this.master.markup[idx];
  }

  getDrafts(){
    return Object.keys(this.master.markup);
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
