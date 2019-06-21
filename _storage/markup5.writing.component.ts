import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild, ElementRef, IterableDiffers, DoCheck, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { MasterService } from '../../../../services/master.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { NodeModel } from '../../../../models/node.model';

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
    }).bind(this), 500);
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

  markup_options_fontsize = 12;
  pageheight_desktop_12 = 730;
  pageheight_tablet_12 = 830;
  pageheight_mobile_12 = 930;
  markup_height = 0;

  pagelimit = 705;
  rowsperpage = 52; //based on line height at default 12pt Courier New (8px)
  charsperrow = 60; //avaerage based on font size at default 12pt (483px / 8px)
  fontsize = 8; //12pt (for Courier New, when measured gives 8px width per character approx) - it depends on font
  lineheight = 14; // line height 12px (when measured for Courier New it's around 14px)
  margins = 112; //default 56px (according to Indesign is 2cm, but online is 1.4cm??) * 2 - 84px (72ppi)
  //pagewidth = 483; //A4 width  - margins (595 - 112) - 730px (72ppi)
  pagewidth = 449;
  pageheight = 730; //A4 (842 - 112)
  totalrows = 0;
  elrows = 0;

  //898

  //pdf options
  pdf_option_margin = '2cm'; //56px (2cm)
  pdf_option_papersize = 'A4'; //595px width 842px height (72ppi)

  constructor(private lib: Library, private service: MasterService, differs: IterableDiffers) {
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
    if(markup.clientWidth >= 1200){
      this.device = 'desktop';
    }
    if((markup.clientWidth < 1200) && (markup.clientWidth > 600)){
      this.device = 'tablet';
    }
    if(markup.clientWidth <= 600){
      this.device = 'mobile';
    }
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
    //this.markup_height =  markup.clientHeight;

    /****** Correct textareas ******/
    markup.querySelectorAll('textarea').forEach(textarea =>{
      this.autoGrowTextZone(textarea);
    });


    /****** Check device *******/
    await this.onResizeDeviceCheck(markup);

    /****** Do pagebreaks ******/
    await this.clearPageBreaks(markup);
    await this.checkPageBreaks(markup);

  }

  async clearPageBreaks(markup){
    for (var i = 0, len = markup.children.length; i < len; i++) {
        let el = markup.children[i];
        console.log(el);
        if(this.lib.isDefined(el)){
          if(el.classList.contains('pagebreak')){
             el.remove();
          }
        }
      }
  }

  async checkPageBreaks(markup){
    let markup_height = markup.clientHeight;
    //let markup_diffheight = (markup_newheight - this.markup_height);
    //setTimeout(()=>{
      for (let i = 1, len = markup_height; i < len; i++) {
        if(i % eval('this.pageheight_' + this.device + '_' + this.markup_options_fontsize) === 0){
          console.log(i);
          this.createPageBreak(markup,i);
        }
      }
    //},300);


    //this.markup_height = markup_newheight;

  }

  async createPageBreak(markup,height){
    let divider = document.createElement("hr");
        divider.classList.add("pagebreak");
        divider.style.top = height + 'px';
        markup.prepend(divider);
  }

  // async clearPageBreaks(markup){
  //   for (var i = 0, len = markup.children.length; i < len; i++) {
  //     let el = markup.children[i];
  //     for (var j = 0, len2 = el.children.length; j < (len2-1); j++) {
  //       let el_child = el.children[j];
  //       if(el_child.classList.contains('pagebreak')){
  //          el_child.remove();
  //       }
  //     }
  //   }
  // }
  //
  //
  // async addPageBreaks(markup){
  //   this.totalrows = 0;
  //
  //   for (var i = 0; i < markup.children.length; i++) {
  //       let el = markup.children[i];
  //       console.dir(el);
  //       //get characters per row based on pdf page width / fontsize
  //       //let charsperrow = this.pagewidth / this.fontsize;
  //
  //       //get hard returns
  //       let hardreturns = el.textContent.split(/\r|\r\n|\n/);
  //       let rows = hardreturns.length;
  //       this.elrows = 0;
  //       this.checkReturns(el,hardreturns);
  //       //calculate soft returns
  //       for(let i = 0,len = rows; i < len; i++){
  //         let line = hardreturns[i];
  //         let softreturns = Math.round(line.length / this.charsperrow);
  //         //if softreturns > 0, minus by one (hard return already counted)
  //         softreturns = Math.round(softreturns > 0 ? (softreturns - 1) : 0);
  //         this.checkReturns(el,softreturns);
  //       }
  //
  //       //depending on element, add an extra break
  //       if(i < markup.children.length-1 && ['s','dialogue','body'].includes(el.classList[2])) this.totalrows += 1;
  //
  //       console.log(this.totalrows);
  //   }
  // }
  //
  // async checkReturns(el,returns){
  //   for(let k=0; k < returns; k++){
  //     this.totalrows += 1;
  //     this.elrows += 1;
  //     if (this.totalrows % this.rowsperpage === 0){
  //       this.createPageBreak(el);
  //     }
  //   }
  // }
  //
  //
  // async createPageBreak(el){
  //   let divider = document.createElement("hr");
  //       divider.classList.add("pagebreak");
  //       divider.style.top = (this.elrows * this.lineheight) + 'px';
  //       el.prepend(divider);
  // }



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
  converttoHTML(){
    let html = '<style>.pdf_export_container *, .pdf_export_container{font: 12px \'Courier New\', sans-serif!important; line-height:12px}'+
               '.el_s{font-weight:bold!important;text-align:left;}'+
               '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_b{font-weight:normal!important;text-align:left;}'+
               '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '</style>';
    this.markup.forEach(el=>{
      switch(el.key){
        case 's':
          html += '<div class="el_s">' + el.value.name.value + '</div><br>';
        break;
        case 'c':
          html += '<div class="el_c">' + el.value.name.value + '</div>';
        break;
        case 'p':
          html +=  '<div class="el_p">' + el.value.name.value + '</div>';
        break;
        case 'body':
          html += '<div class="el_b">' + el.value + '</div><br>';
        break;
        case 'dialogue':
          html += '<div class="el_d">' + el.value + '</div><br>';
        break;
      }
    });
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return html;
  }

  autoGrowTextZone(e) {
    e.style.height = "0px";
    e.style.height = (e.scrollHeight + 25)+"px";
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
