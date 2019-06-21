import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild, ElementRef, IterableDiffers, DoCheck, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { MasterService } from '../../../../services/master.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { NodeModel } from '../../../../models/node.model';

import { PageDivideService } from '../services/PageDivideService/pagedivide.service';

import * as html2canvas from "html2canvas"

@Component({
  selector: 'comp-writing-markup',
  templateUrl: './markup.writing.component.html',
  styleUrls: ['./markup.writing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkupWritingComponent implements OnInit, OnChanges, DoCheck {

  @Input() master: any = {};
  @Output() callback = new EventEmitter();
  @ViewChild('pdf') pdf: any;
  @ViewChild('iframe') previewFrame: ElementRef;

  @HostListener('window:resize', ['$event'])
  onWindowResize(e){
    //debounce resize, wait for resize to finish before doing stuff
    if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
        console.log('Resize complete');
        if(!this.pdfPreview) this.updateMarkup();
    }).bind(this), 200);
  }

  private el: HTMLInputElement;
  private nodeModel: NodeModel = new NodeModel();
  draft:number = 0;
  markup:any;
  html:string;
  input:string;
  selectGidx: number = -1;
  selectGitm:any;
  pdfPreview:boolean = false;
  showPageDividers:boolean = true;
  differ: any;
  device:string = 'desktop';
  resizeTimeout:any;

  //page divider defaults
  markup_options_fontsize = 12;
  pagewidth_12 = 547;
  pageheight_12 = 828;
  markup_height = 0;
  rowsperpage =  52;
  charsperrow = 57;
  totalrows = 0;
  breakcount = 0;

  //pdf options
  pdf_option_margins = {
    left: "1.5in",
    right: "1in",
    top: "1in",
    bottom: "1in"
  }
  pdf_option_pagebreak = '.pagebreak';
  pdf_option_papersize = 'A4'; //595px width 842px height (72ppi)

  constructor(private lib: Library, private service: MasterService, differs: IterableDiffers, private pageDivide: PageDivideService) {
    this.differ = differs.find([]).create(null);
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngDoCheck(){
    const markupchange = this.differ.diff(this.markup);
    if(markupchange !== null) this.updateMarkup();
  }

  ngOnInit() {
    this.markup = this.master.markup[this.draft];
    let markup =  <HTMLElement>document.querySelectorAll('.markup_editor')[0];
    this.markup_height =  markup.clientHeight;
  }

  /* On Resize */

  async onResizeDeviceCheck(markup){
    if(markup.clientWidth >= 1200) this.device = 'desktop';
    if((markup.clientWidth < 1200) && (markup.clientWidth > 690)) this.device = 'tablet';
    if(markup.clientWidth <= 690) this.device = 'mobile';
  }

  /* Specific component functions */

  //Elements

  createElement(el:string){
    let nel = this.lib.deepCopy(this.master[el]);
    nel.id = this.service.items.getNewId(this.markup);
    this.markup.push(nel);
  }

  updateElement(el,idx,val,elpath){
    const v = val !== '' ? val : eval('el.' + elpath);
    eval('el.' + elpath + ' = v');
    this.input = this.lib.deepCopy(v);
    this.checkGroups(el);
  }

  editElement(action,el,idx){
    switch(action){
      case 'copy': this.markup.push(this.lib.deepCopy(el)); break;
      case 'delete': this.lib.delete(idx,this.markup); break;
    }
    this.checkGroups(el);
  }

  dragElement(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.markup, event.previousIndex, event.currentIndex);
  }

  //markup_text

  async updateMarkup(){

    let markup =  <HTMLElement>document.querySelectorAll('.markup_editor')[0];

    /****** Correct textareas ******/
    markup.querySelectorAll('textarea').forEach(textarea =>{
      this.autoGrowTextZone(textarea);
    });

    /****** Check device *******/
    await this.onResizeDeviceCheck(markup);

    /****** Do pagebreaks ******/
    await this.pageDivide.clearPageBreaks(markup);
    await this.pageDivide.checkPageBreaks(markup);

  }

  //Groups

  selectGroupItem(e,i){
    this.selectGidx = i;
    this.selectGitm = e;
  }

  checkGroups(el){
    setTimeout(()=>{
      if(Object.keys(this.master.groups).includes(el.key)) {
        this.updateGroups();
      }
    },);
  }

  updateGroups(){
    Object.keys(this.master.groups).forEach(group=>{
      let g = this.master.groups[group];
      Object.keys(this.master.markup).forEach(draft=>{
        this.master.markup[draft].forEach(el =>{
          if(el.key == group){
            //copy node structure for item, id is false
            let item = this.lib.deepCopy(this.nodeModel.node);
            //append default fields
            item.fields = el.value;
            //determine if values match
            let match = g.filter(itm => itm.fields.name.value == el.value.name.value);
            //if there isn't a match, mark as new item
            const isNew = !match.length ? true : false;
            //format ids
            this.service.items.formatItemIds(item,isNew,g);
            //update markup element with new or existing gid
            el.gid = isNew ? item.id : match[0].id;
            //if selected group item, append custom fields
            if(this.selectGidx !== -1 && el.gid == this.selectGitm.id) el.value = this.selectGitm.fields;
            //if new, push item to group
            if(isNew){ g.push(item); }
            //reset index
            this.selectGidx = -1;
          }
        });
      });

      //clear duplicates
      let arr:any = [];
      g.forEach((itm,i) =>{
          const name = itm.fields.name.value;
          arr.includes(name) ? g.splice(i,1) : arr.push(name);
       });
    });
  }

  //Drafts

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

  //Export

  async previewMarkup(){
    if(!this.pdfPreview){
      this.html = await this.converttoHTML();

      setTimeout(()=>{
        let ex = this.pdf.export();
        ex.then(async group =>{
          let data = await this.service.internal.pdfKendo.exportData(group);
          const preview = this.previewFrame.nativeElement;
          preview.src = data;
        });
      },);
    }
    this.pdfPreview = !this.pdfPreview;
  }

  async exportMarkup(){
    this.html = await this.converttoHTML();
    setTimeout(()=>{
      let ex = this.pdf.export();
      this.pdf.saveAs('export.pdf');
    },);
  }

  //Convert

  async converttoHTML(){
    let style = '<style>'+
                '.pdf_export_container *{font-size:12px!important; min-height:auto!important; }'+
                '.el_s{font-weight:bold!important;text-align:left; }'+
                '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_b{font-weight:normal!important;text-align:left; }'+
                '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_br.end.space2{ display:table; content:""; height:0px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.el_br.end.space1{ display:table; content:""; height:0px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.el_c .el_br.end.space1{ display:none!important; height:0px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.el_br.space1{ display:block; content:""; height:0px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                'br{ display:block; content:""; line-height:0px!important; height:0px!important; }'+
                '</style>';
    let html = '';
    this.totalrows = 0;
    this.markup.forEach(async el=>{
      switch(el.key){
        case 's':
          html += '<div class="el_s">' + this.pageDivide.dividePages(el,el.value.name.value + '\n\n') + '</div>';
        break;
        case 'c':
          html += '<div class="el_c">' + this.pageDivide.dividePages(el,el.value.name.value + '\n') + '</div>';
        break;
        case 'p':
          html += '<div class="el_p">' + this.pageDivide.dividePages(el,el.value.name.value) + '</div>';
        break;
        case 'body':
          html += '<div class="el_b">' + this.pageDivide.dividePages(el,el.value + '\n\n') + '</div>';
        break;
        case 'dialogue':
          html += '<div class="el_d">' + this.pageDivide.dividePages(el,el.value + '\n\n') + '</div>';
        break;
      }
    });
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return style+html;
  }

  autoGrowTextZone(e) {
    e.style.height = "0px";
    //e.style.height = (e.scrollHeight + 25)+"px";
    e.style.height = (e.scrollHeight)+"px";
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