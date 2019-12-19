import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Library } from '../../../../../app.library';
import { MasterService } from '../../../../../services/master.service';
import { of } from 'rxjs';

@Component({
  selector: 'comp-writing-segments-modal',
  templateUrl: './segments.writing.modal.component.html',
  styleUrls: ['./segments.writing.modal.component.scss']
})
export class SegmentsWritingModalComponent implements OnInit {

  @Input() items: any = {};
  @Input() public params: any;
  @Input() _t: any;
  segments:any;
  segment:any;
  @Output() callback = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.segments = this._t.params.modalData;
  }

  selectSegment(id){
    this._t.currentsegid = id;
    this._t.params.modalData = false;
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
