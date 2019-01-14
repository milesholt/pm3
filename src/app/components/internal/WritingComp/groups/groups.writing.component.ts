import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { CoreService } from '../../../../services/core.service';


@Component({
  selector: 'comp-writing-groups',
  templateUrl: './groups.writing.component.html',
  styleUrls: ['./groups.writing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupsWritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();
  group: string = 'scene'

  constructor(private lib: Library, private service: CoreService) {}

  ngOnChanges(changes: SimpleChanges) {}
  ngOnInit() {

  }

  /* Specific component functions */


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
