import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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

  constructor(private lib: Library, private service: CoreService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    console.log(this.master);

  }
  ngOnInit() {
    console.log('here');
    console.log(this.master);
  }

  /* Specific component functions */

  createElement(el:string){
    console.log(this.master);
    this.master.markup.push(this.lib.deepCopy(this.master[el]));
  }

  updateGroups(){
    Object.keys(this.master.groups).forEach(group=>{
      let g = this.master.groups[group] = [];
      let vals = [];
      this.master.markup.forEach(el =>{
        //if(el.key == group && g.indexOf(el.value) === -1) g.push(el.value);
        if(el.key == group){
          if(g.length === 0){
            g.push(el.value);
          }else{
            if(g.map(itm => itm.name).indexOf(el.value.name) === -1) g.push(el.value);
          }
        }
      });
    });
  }

  updateElement(el,idx,val){
    console.log(el);
    setTimeout(()=>{
      if(Object.keys(this.master.groups).includes(el.key)) this.updateGroups();
    },2000);
  }

  editElement(action,el,idx){
    switch(action){
      case 'copy': this.master.markup.push(this.lib.deepCopy(el)); break;
      case 'delete': this.lib.delete(idx,this.master.markup);
    }
    this.updateGroups();
  }

  dragElement(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.master.markup, event.previousIndex, event.currentIndex);
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
