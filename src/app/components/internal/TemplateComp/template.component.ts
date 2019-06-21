import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { MasterService } from '../../../services/master.service';
import { of } from 'rxjs';

@Component({
  selector: 'comp-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();

  constructor() { }

  ngOnInit() {}


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
