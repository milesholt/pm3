import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../app.library';
import { MasterService } from '../../../services/master.service';

import { Router, ActivatedRoute } from '@angular/router';

import {MarkupWritingComponent} from './markup/markup.writing.component';
import {EditorWritingComponent} from './editor/editor.writing.component';
import {GroupsWritingComponent} from './groups/groups.writing.component';
import {GroupsWritingModalComponent} from './groups/groups.modal/groups.writing.modal.component';
import {SegmentsWritingModalComponent} from './segments/segments.modal/segments.writing.modal.component';

import { ItemModel } from '../../../models/item.model';

@Component({
  selector: 'comp-writing',
  templateUrl: './writing.component.html',
  styleUrls: ['./writing.component.scss'],
  providers: [MarkupWritingComponent, EditorWritingComponent],
  encapsulation: ViewEncapsulation.None
})
export class WritingComponent implements OnInit, OnChanges {

  @Input() items: any = {};
  @Output() callback = new EventEmitter();
  itemModel: ItemModel = new ItemModel();

  section: string = 'markup';
  id:number;

  master:any = {
    // groups: {
    //   's_orig' : [{ "id": 0, "orderid": 0, "date_created": "", "date_updated": "", "fields": { "name": { "value": "Custom 1", "type": "text" }, "desc": { "value": "", "type": "text" }, "Prop": { "key": "Prop", "value": "11", "type": "custom", "type_options": [], "unique": false } }, "nest": [], "params": {} } ],
    //   's' : [ { "id": 0, "orderid": 0, "date_created": "", "date_updated": "", "fields": { "name": { "value": "Custom 1", "type": "text" }, "desc": { "value": "", "type": "text" }, "Prop": { "key": "Prop", "value": "11", "type": "custom", "type_options": [], "unique": false } }, "nest": [], "params": {} }, { "id": 1, "orderid": 1, "date_created": "", "date_updated": "", "fields": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "nest": [], "params": {} } ],
    //   'c': [ { "id": 0, "orderid": 0, "date_created": "", "date_updated": "", "fields": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "nest": [], "params": {} } ],
    //   'p': []
    // },
    groups: {
      's': [],
      'c': [],
      'p': []
    },
    markup_0: { 0 : [] },
    markup: { 0 : [ { "id": 1, "segments": [ { "id": 0, "elements": [ { "key": "s", "value": { "name": { "value": "CUSTOM1", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "gid": 0 }, { "key": "body", "value": "Test 1", "type": "textarea" } ], "params": { "name": "Segment1", "tags": [] } } ], "params": { "sid": 0 } } ]},
    markup_1: { "0": [ { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elementum venenatis quam, suscipit viverra urna. Duis aliquet vulputate ante, at venenatis risus pharetra nec. Suspendisse potenti. Maecenas nulla justo, tincidunt ut diam quis, sodales varius nunc. Sed ut nisl non metus tempor luctus a in metus. Vestibulum at rhoncus ligula, at varius elit. Fusce ultrices risus id justo tincidunt mollis. Mauris quis dolor dignissim, pulvinar velit ac, pulvinar mi. Nullam lacus ligula, placerat sit amet congue ut, pulvinar sed neque. Suspendisse varius quam risus, eget laoreet ante auctor in. Donec eu mi vitae nunc pretium consequat. In hac habitasse platea dictumst. Vivamus malesuada velit sed lectus molestie, at eleifend dui ultricies.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elementum venenatis quam, suscipit viverra urna. Duis aliquet vulputate ante, at venenatis risus pharetra nec. Suspendisse potenti. Maecenas nulla justo, tincidunt ut diam quis, sodales varius nunc. Sed ut nisl non metus tempor luctus a in metus. Vestibulum at rhoncus ligula, at varius elit. Fusce ultrices risus id justo tincidunt mollis. Mauris quis dolor dignissim, pulvinar velit ac, pulvinar mi. Nullam lacus ligula, placerat sit amet congue ut, pulvinar sed neque. Suspendisse varius quam risus, eget laoreet ante auctor in. Donec eu mi vitae nunc pretium consequat. In hac habitasse platea dictumst. Vivamus malesuada velit sed lectus molestie, at eleifend dui ultricies.", "type": "textarea", "id": 1 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque elementum venenatis quam, suscipit viverra urna. Duis aliquet vulputate ante, at venenatis risus pharetra nec. Suspendisse potenti. Maecenas nulla justo, tincidunt ut diam quis, sodales varius nunc. Sed ut nisl non metus tempor luctus a in metus. Vestibulum at rhoncus ligula, at varius elit. Fusce ultrices risus id justo tincidunt mollis. Mauris quis dolor dignissim, pulvinar velit ac, pulvinar mi. Nullam lacus ligula, placerat sit amet congue ut, pulvinar sed neque. Suspendisse varius quam risus, eget laoreet ante auctor in. Donec eu mi vitae nunc pretium consequat. In hac habitasse platea dictumst. Vivamus malesuada velit sed lectus molestie, at eleifend dui ultricies.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 } ] },
    markup_2: { "0": [ { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut nibh euismod, interdum ligula eu, blandit lacus. Nam varius euismod imperdiet. Donec dapibus ligula in orci sollicitudin commodo. Mauris sollicitudin elit in rhoncus interdum. Etiam nec massa accumsan velit sollicitudin pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris rhoncus eros sit amet molestie interdum. Pellentesque faucibus lorem sapien, sed semper elit dictum vel. Nunc ut laoreet elit. Praesent pharetra tellus vel finibus fringilla. Aliquam pharetra mattis magna sit amet scelerisque. Nullam sed diam aliquet massa tempor congue vel et mi. Pellentesque ex erat, blandit nec erat non, sagittis hendrerit nulla. Morbi quam velit, dictum et nisl nec, porttitor fermentum risus. Etiam tincidunt mi vel lobortis ultricies.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Mauris mattis nec eros id posuere. Mauris tempus fringilla magna, ac laoreet nibh pharetra et. Mauris id lacus in turpis ullamcorper pulvinar sed ut ante. Nam pretium posuere tellus. Fusce scelerisque erat justo, quis mollis eros tempus in. Quisque tincidunt volutpat mauris, nec viverra felis pretium vel. Quisque fringilla vulputate leo in scelerisque. Mauris scelerisque sem id nisl euismod, nec luctus metus dictum. Quisque ut nisi interdum, sagittis felis eget, ornare tellus. Suspendisse vel dignissim erat, et luctus metus.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Curabitur vitae pellentesque metus. Etiam sodales nisi at velit eleifend posuere. Suspendisse eget pretium nulla. Aenean ornare risus id vulputate convallis. Maecenas arcu libero, viverra ut tristique eget, pharetra ut lectus. Integer eleifend dapibus turpis, eget rhoncus tellus porta non. Nunc tellus dolor, accumsan id mi vitae, sollicitudin gravida sem. Ut vestibulum felis eget dui auctor dapibus. Donec varius sagittis ipsum at dignissim. Mauris et vestibulum diam. Nam hendrerit ultricies lectus quis luctus. Aliquam eget magna quis risus imperdiet blandit sit amet quis nunc.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 } ] },
    markup_3: { "0": [ { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Duis elit nunc, auctor eu urna in, commodo maximus nisi. Suspendisse nec placerat tellus. Ut a dui suscipit, facilisis quam vitae, tempus augue. Donec sed lobortis leo, vel volutpat nisl. Duis eleifend metus vitae tincidunt volutpat. Cras imperdiet eu odio sed sagittis. Fusce aliquam mi eget luctus pharetra. Curabitur quis lacus condimentum, condimentum arcu vitae, molestie arcu. Nulla facilisi. Ut congue lobortis nunc vel interdum.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Pellentesque quis blandit justo, ut laoreet neque. Curabitur ultricies consectetur molestie. Praesent at viverra tellus, a ullamcorper risus. Cras mollis risus sed velit dapibus, at efficitur elit volutpat. \n\nMaecenas dignissim ornare enim at scelerisque. Aenean fringilla ante at velit rutrum mollis. Morbi sed finibus odio, vel rhoncus metus.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Maecenas in pellentesque tortor, volutpat finibus metus. Donec lobortis tempor erat, vel placerat mauris cursus quis. Pellentesque nec magna non libero mollis tempor. Suspendisse scelerisque dui sit amet tortor lobortis sollicitudin. Integer viverra laoreet finibus. Sed quis tortor tellus. Ut ut sagittis nisl. Phasellus tincidunt elementum sem, non imperdiet enim faucibus in. Sed et auctor purus. Vivamus at libero urna. Praesent sit amet rutrum nunc, condimentum hendrerit eros. Nunc a pulvinar mi, in mattis metus.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Integer viverra laoreet finibus. Sed quis tortor tellus. Ut ut sagittis nisl. Phasellus tincidunt elementum sem, non imperdiet enim faucibus in. Sed et auctor purus. Vivamus at libero urna. Praesent sit amet rutrum nunc, condimentum hendrerit eros. Nunc a pulvinar mi, in mattis metus.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 } ] },
    markup_4: { "0": [ { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Vivamus sed nisi ut nisi blandit posuere. Duis sit amet massa mi. Maecenas ante massa, condimentum tincidunt auctor a, sollicitudin quis velit. Vestibulum at est a augue commodo scelerisque vitae non tellus.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Ut orci odio, feugiat non elementum quis, viverra vitae turpis. Morbi ipsum velit, semper sit amet metus vel, dignissim feugiat mi. Donec vulputate tincidunt maximus. Donec posuere facilisis elit, ac rutrum nulla mollis vitae. Vivamus sagittis tincidunt ante non fermentum. Donec et facilisis tortor. Curabitur commodo congue ante sit amet varius. Integer eget risus ac diam porttitor gravida. Nunc eros neque, blandit ut augue a, faucibus commodo est. Interdum et malesuada fames ac ante ipsum primis in faucibus.", "type": "textarea", "id": 1 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Nam aliquam, lectus at commodo porta, est mauris semper ipsum, id lacinia ipsum magna at libero. Phasellus volutpat ligula et vestibulum condimentum. Etiam sed tempus urna, ut maximus enim. Donec pharetra magna vel metus tempus vulputate. Etiam convallis tortor in mi bibendum, id interdum lorem fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nSed ut lorem tristique, consequat velit in, hendrerit nulla. Duis bibendum dolor non nibh blandit, eget elementum justo rutrum. Suspendisse vel interdum mauris. Morbi lacinia diam id magna placerat, a placerat mauris efficitur. Quisque finibus augue turpis, et ornare nulla maximus quis.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Duis ultrices leo non lectus finibus feugiat. Aenean turpis odio, tempor interdum convallis quis, interdum eu risus. Aenean tempor a dui non vehicula. Vestibulum ut massa metus. Mauris neque metus, facilisis quis ornare quis, hendrerit scelerisque elit. Proin mattis euismod semper.\n\nDuis ultrices leo non lectus finibus feugiat. Aenean turpis odio, tempor interdum convallis quis, interdum eu risus. Aenean tempor a dui non vehicula. Vestibulum ut massa metus. Mauris neque metus, facilisis quis ornare quis, hendrerit scelerisque elit. Proin mattis euismod semper.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 } ] },
    markup_5: { "0": [ { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Donec ullamcorper felis ac dictum blandit. Quisque nibh sem, suscipit sit amet justo nec, bibendum interdum magna. Nulla facilisi. Integer lectus ante, tristique at ante ac, scelerisque dictum orci. Etiam dui elit, pulvinar sit amet felis vel, sagittis faucibus arcu. Fusce pretium, libero quis euismod vestibulum, leo felis mollis elit, sed ornare sem velit lobortis augue. Aliquam efficitur, mauris ac tempus commodo, odio eros ullamcorper augue, eget eleifend leo nunc id arcu. Phasellus fermentum, nisi non dignissim euismod, mi diam varius elit, ut pretium tellus sapien a ipsum. Maecenas ultrices mollis quam. Suspendisse imperdiet, neque et pretium vestibulum, nulla ipsum egestas ante, in rhoncus eros mauris a diam.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Proin dui felis, volutpat in urna sed, interdum porta velit. Sed venenatis ullamcorper lectus in maximus. Proin lacinia, diam eu luctus ultricies, augue elit posuere purus, sed tristique nisi felis nec purus. Vestibulum magna tellus, elementum ut accumsan et, tempor id libero. Maecenas tortor enim, lacinia vehicula hendrerit nec, hendrerit vitae dui. Mauris sed facilisis dui. Aliquam dignissim fermentum elit, eu laoreet ante. In hac habitasse platea dictumst. Sed pharetra leo non pharetra lobortis. Nulla efficitur ex a libero aliquet, ut vulputate erat bibendum. Nunc ultricies dolor vel ante vulputate, sit amet porttitor purus consequat. Quisque in nunc varius ipsum porttitor porta non in mauris. Nullam ac sodales nibh.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Cras tempor pulvinar lectus. Vivamus commodo enim eu consequat maximus. Curabitur aliquam lorem eget tempus tempor. Mauris sit amet velit eu lacus consequat condimentum in quis orci. Aenean at tempor enim. Nullam arcu erat, rutrum eu justo et, dapibus dignissim eros. Praesent malesuada facilisis interdum. Quisque a iaculis magna, sed cursus metus. \n\nCras tempor tristique orci, et lobortis lorem mollis ac. Phasellus sodales quam et tortor iaculis eleifend. Fusce consequat dapibus sem eu facilisis. Morbi a lacinia ex. Aenean non massa semper, pharetra felis at, aliquam tortor.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "s", "value": { "name": { "value": "asdasdasdasdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 0, "gid": 1 }, { "key": "body", "value": "Duis ultrices leo non lectus finibus feugiat. Aenean turpis odio, tempor interdum convallis quis, interdum eu risus. Aenean tempor a dui non vehicula. Vestibulum ut massa metus. Mauris neque metus, facilisis quis ornare quis, hendrerit scelerisque elit. Proin mattis euismod semper.\n\nDuis ultrices leo non lectus finibus feugiat. Aenean turpis odio, tempor interdum convallis quis, interdum eu risus. Aenean tempor a dui non vehicula. Vestibulum ut massa metus. Mauris neque metus, facilisis quis ornare quis, hendrerit scelerisque elit. Proin mattis euismod semper.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 }, { "key": "body", "value": "Cras tempor pulvinar lectus. Vivamus commodo enim eu consequat maximus. Curabitur aliquam lorem eget tempus tempor. Mauris sit amet velit eu lacus consequat condimentum in quis orci. Aenean at tempor enim. Nullam arcu erat, rutrum eu justo et, dapibus dignissim eros. Praesent malesuada facilisis interdum. Quisque a iaculis magna, sed cursus metus. \n\nCras tempor tristique orci, et lobortis lorem mollis ac. Phasellus sodales quam et tortor iaculis eleifend. Fusce consequat dapibus sem eu facilisis. Morbi a lacinia ex. Aenean non massa semper, pharetra felis at, aliquam tortor.", "type": "textarea", "id": 1 }, { "key": "c", "value": { "name": { "value": "asdasd", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 2, "gid": 0 }, { "key": "p", "value": { "name": { "value": "(asdasdasd)", "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": 3, "gid": 0 }, { "key": "dialogue", "value": "asdasddasdsda\nasdasdasdasdasd\ndasdasdasdsdas\ndasd", "type": "textarea", "id": 4 } ] },
    newvalues: {},
    newvalue: '',
    elements:{
      s: {
        key: "s",
        value: this.lib.deepCopy(this.itemModel.document),
        type: "string"
      },
      body: {
        key: "body",
        value: this.lib.deepCopy(this.itemModel.document),
        type: "textarea"
      },
      c: {
        key: "c",
        value: this.lib.deepCopy(this.itemModel.document),
        type: "string"
      },
      p:{
        key: "p",
        value: this.lib.deepCopy(this.itemModel.document),
        type: "string"
      },
      d:{
        key: "dialogue",
        value: this.lib.deepCopy(this.itemModel.document),
        type: "textarea"
      }
    },
    segment:{
      id:-1,
      elements:[],
      params:{
        name:"",
        tags:[]
      }
    },
    segmentgroup:{
      id:0,
      segments:[],
      params:{
        sid: 0
      }
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

  constructor(private lib: Library, private service: MasterService, private router: Router, private route: ActivatedRoute) {
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
export { MarkupWritingComponent, EditorWritingComponent, GroupsWritingComponent, GroupsWritingModalComponent, SegmentsWritingModalComponent }
