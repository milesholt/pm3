import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild, ElementRef, IterableDiffers, DoCheck, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { MasterService } from '../../../../services/master.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { NodeModel } from '../../../../models/node.model';

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
  //pageheight_12 = 880 (55 x 16px);
  pageheight_12 = 928; //no idea
  markup_height = 0;
  rowsperpage =  55;
  charsperrow = 57;

  //pdf options
  pdf_option_margins = {
    left: "1.5in",
    right: "1in",
    top: "1in",
    bottom: "1in"
  }
  pdf_option_pagebreak = '.pagebreak';
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
    await this.clearPageBreaks(markup);
    await this.checkPageBreaks(markup);

  }

  async clearPageBreaks(markup){
    markup.children[0].remove();
    let dividers = document.createElement("div");
    dividers.classList.add("pagedividers");
    markup.prepend(dividers);
  }

  async checkPageBreaks(markup){
    for (let i = 1, len = markup.clientHeight; i < len; i++) {
      if(i % eval('this.pageheight_' + this.markup_options_fontsize) === 0){
        this.createPageBreak(markup,i);
      }
    }
  }

  async createPageBreak(markup,height){
    let divider = document.createElement("hr");
        divider.classList.add("pagebreak");
        divider.style.top = height + 'px';
        markup.children[0].append(divider);
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
               '.pdf_export_container *{font-size:12px!important;}'+
               '.el_s{font-weight:bold!important;text-align:left;}'+
               '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_b{font-weight:normal!important;text-align:left;}'+
               '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '</style>';
    let html = '';
    //this.totalrows = 0;
    this.markup.forEach(async el=>{
      switch(el.key){
        case 's':
          html += '<div class="el_s">' + el.value.name.value + '</div><br>';
        break;
        case 'c':
          html += '<div class="el_c">' + el.value.name.value + '</div>';
        break;
        case 'p':
          html += '<div class="el_p">' + el.value.name.value + '</div>';
        break;
        case 'body':
          html += '<div class="el_b">' + el.value + '</div>';
        break;
        case 'dialogue':
          html += '<div class="el_d">' + el.value + '</div><br>';
        break;
      }
    });
    console.log(html);
    //html = this.dividePages(html);
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return style+html;
  }

  dividePages(el){
    let hardreturns = el.split(/\r|\r\n|\n/);
    let pagerows = 0;
    let html_arr = [];
    //loop through hard returns
    hardreturns.forEach((hr,i) => {
      //console.log(i);
      let hrrows = 0;
      //push return to html array
      html_arr.push(hr)
      //for each hard return, get number of soft returns
      let sr = Math.round(hr.length / this.charsperrow) + 1; //increment index by one
      //console.log(sr);
      //loop through soft returns
      for(let  j =1, len = sr; j <= len; j++){
        //increment page rows for each return
        pagerows++;
        hrrows++;
        //if pagerow is at least the number of rows per page or a multiple
        if (pagerows > 0 && pagerows % this.rowsperpage === 0){
          //for this hard return, create a page division, reset pagerows
          html_arr[i] = this.createDivide(html_arr[i],(pagerows-hrrows));
          //reset pagerows for new page
          pagerows = 0;
        }
      }

    });
    let html = html_arr.join('<br>');
    return html;
  }

  createDivide(hr,rows){
    let pagebreaked =  false;
    let char = 0;
    let lines = '';
    let newrows = 0;
    //split hard return into words
    let words = hr.split(' ');
    //loop through words
    words.forEach(word => {
      //console.log(char);
      let lbreak = '';
      //count number of characters
      for(let i = 1,len = word.length; i <= len; i++){
        char++;
        //if number of characters per row reached or multiple, add line break
        if(char === this.charsperrow) { char = 0; newrows++; lbreak = '';  }
      }
      //append word to lines
      lines += word + ' ' + lbreak;
      lbreak = '';
      //if number of rows per page reached, add page break
      if((rows + newrows) === this.rowsperpage && !pagebreaked){
        lines += '<span class="pagebreak"></span>';
        pagebreaked =  true;
      }
    });
    return lines;
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
