import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'comp-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();

  headings:any = [];
  characters:any = [];
  groups:any = ['headings','characters']
  markup:any = [];
  newvalues:any = {};
  newvalue:string = '';
  heading:any = {
    key: "heading",
    value:"",
    type:"string"
  };
  body:any = {
    key: "body",
    value:"",
    type:"textarea"
  };
  character:any = {
    key: "character",
    value:"",
    type:"string"
  };
  parenthetical:any = {
    key: "parenthetical",
    value:"",
    type:"string"
  };
  dialogue:any = {
    key: "dialogue",
    value:"",
    type:"textarea"
  };

  private el: HTMLInputElement;

  constructor(private lib: Library, private service: CoreService) {}

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {}

  createElement(el:string){
    this.markup.push(this.lib.deepCopy(this[el]));
  }

  updateGroups(){
    this.groups.forEach(group=>{
      this[group] = this.markup.filter((el) => el.key == group.slice(0, -1)).map(el => el.value);
      let unique = new Set(this[group]);
      console.log(unique);
      this[group] = unique;
      //this[group] = new Set(this[group]);
    });
  }

  updateElement(el,idx,val){
    setTimeout(()=>{
      if(['heading','character'].includes(el.key)) this.updateGroups();
    },2000);
  }

  editElement(action,el,idx){
    switch(action){
      case 'copy': this.markup.push(this.lib.deepCopy(el)); break;
      case 'delete': this.lib.delete(idx,this.markup);
    }
    this.updateGroups();
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
