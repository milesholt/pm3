import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';
import { of } from 'rxjs';


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
    name:{value:"",type:"string"},
    desc:{value:"",type:"string"},
    dialogue:{value:"",type:"textarea"}
  };

  constructor(private lib: Library, private service: CoreService) { }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log('change');
    console.log(changes);
  }

  ngOnInit() {}

  createElement(el:string){
    //this.markup.push({ key: el, val : this.lib.deepCopy(this[el]) });
    this.markup.push(this.lib.deepCopy(this[el]));
  }

  storeElement(val:string,type:string){
    this[type].push(val);
  }

  updateElement(val, el, prop, idx){
    let mu = this.markup;
    let ref = mu[idx].value ? mu[idx] : mu[idx][prop.key];
    ref.value = val;
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
