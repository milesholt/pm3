import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';


@Component({
  selector: 'comp-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss']
})
export class WritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();

  headings:any = [];
  characters:any = [];
  markup:any = [];
  newvalues:any = {};
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
  description:any = {
    key: "description",
    value:"",
    type:"string"
  };
  dialogue:any = {
    key: "dialogue",
    value:"",
    type:"textarea"
  };

  constructor(private lib: Library, private service: CoreService) { }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit() {}

  createElement(el:string){
    this.markup.push(this.lib.deepCopy(this[el]));
  }

  storeElement(elkey){
    this[elkey+'s'] = this.markup.filter(el => el.key == elkey).map(el => el.value);
  }

  updateElement(el){
    if(['heading','character'].includes(el.key)) this.storeElement(el.key);
  }

  checkForSmartSuggest(){
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
