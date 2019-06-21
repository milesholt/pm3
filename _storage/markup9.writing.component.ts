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
  //pageheight_12 = 928;
  //pageheight_12 = 828; //55 rows
  pageheight_12 =785;
  markup_height = 0;
  //rowsperpage =  55;
  rowsperpage =  54;
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


  // .input.el_s, .input.el_dialogue, .el_body{
  //   padding-bottom:20px!important;
  // }
  //
  // .input.el_c{
  //   padding-bottom:10px!important;
  // }

  //Convert
  async converttoHTML(){
    // let style = '<style>'+
    //            '.pdf_export_container *{font-size:12px!important; min-height:auto!important;}'+
    //            '.el_s{font-weight:bold!important;text-align:left; padding-bottom:20px!important;}'+
    //            '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding-bottom:10px!important;}'+
    //            '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 0px 0px;}'+
    //            '.el_b{font-weight:normal!important;text-align:left; padding-bottom:20px!important;}'+
    //            '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding-bottom:20px!important;}'+
    //            '</style>';
    let style = '<style>'+
                '.pdf_export_container *{font-size:12px!important; min-height:auto!important; }'+
                '.el_s{font-weight:bold!important;text-align:left; }'+
                '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_b{font-weight:normal!important;text-align:left; }'+
                '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; }'+
                '.el_c .el_br.space1{ height:6px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.end .el_br.space1{ height:18px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.el_br.space2{ height:18px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                '.el_br.space1{ height:13px!important; line-height:0px!important; font-weight:normal!important; padding:0px!important; margin:0px!important; text-transform:normal!important; }'+
                'br{ display:block; content:""; line-height:0px!important; height:0px!important; }'+
                '</style>';
    let html = '';
    this.totalrows = 0;
    this.markup.forEach(async el=>{
      switch(el.key){
        case 's':
          html += '<div class="el_s">' + this.dividePages(el.value.name.value + '<div class="end">\n\n</div>') + '</div>';
        break;
        case 'c':
          html += '<div class="el_c">' + this.dividePages(el.value.name.value + '\n') + '</div>';
        break;
        case 'p':
          html += '<div class="el_p">' + this.dividePages(el.value.name.value) + '</div>';
        break;
        case 'body':
          html += '<div class="el_b">' + this.dividePages(el.value + '<div class="end">\n\n</div>') + '</div>';
        break;
        case 'dialogue':
          html += '<div class="el_d">' + this.dividePages(el.value + '<div class="end">\n\n</div>') + '</div>';
        break;
      }
    });
    console.log(html);
    //html = this.dividePages(html);
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return style+html;
  }

  dividePages_off(el){
    return el;
  }

  dividePages(el){
    //  let linebreaks = el.split('\n\n');
    // // //
    // // // console.log(linebreaks);
    // if(linebreaks.length > 1){
    //   this.breakcount = this.breakcount + (linebreaks.length - 1);
    //   // console.log(this.totalrows);
    //   // console.log(this.breakcount);
    //   this.totalrows = (this.totalrows + this.breakcount);
    //   // console.log(this.totalrows);
    //    //this.totalrows++;
    //   //this.breakcount++;
    //   //this.totalrows = this.totalrows + (linebreaks.length - 1);
    //   //this.totalrows = (this.totalrows + this.breakcount);
    //   //console.log(this.breakcount);
    // }

    let hardreturns = el.split(/\r|\r\n|\n/);
  //console.log(hardreturns);
    //let pagerows = this.totalrows;
    let _t = this;
    let html_arr = [];
    //loop through hard returns
    let linebr = 0;

    //let c = [];
    hardreturns.forEach((hr,i) => {

      console.log(hr);
      let content = '';
      let breaks = '';
      let cidx = 0;
      let hrrows = 0;
      let pagethreshold = false;
      // if(hr !== ''){
      //     console.log(hr);
      //   _t.totalrows++; //add linebreak for each hard return
      //   hrrows++;
      //   _t.breakcount++;
      //   console.log('newbreak: '+ _t.breakcount);
      // }
      //console.log(hr);

      if(hr !== ''){
        linebr = 0;
        cidx = this.lib.deepCopy(i);
        //c.push(this.lib.deepCopy(hr));
        //console.log(hr);
        //content = hr;
        //push return to html array

        //for each hard return, get number of soft returns
        let sr = Math.round(hr.length / this.charsperrow) + 1; //increment index by one
        //console.log(sr);
        //loop through soft returns
        for(let  j =1, len = sr; j <= len; j++){
          //increment page rows for each return
          _t.totalrows++;
          hrrows++;
          if (_t.totalrows > 0 && _t.totalrows % this.rowsperpage === 0){
            hr = this.createDivide(hr,(_t.totalrows-hrrows));
            //reset pagerows for new page
            //console.log('breaks: '+ _t.breakcount);
            _t.totalrows = 0;
          }
        }

        html_arr.push(hr+_t.totalrows);
        //html_arr.push(hr);
      } else {
        //console.log(hr);
        linebr++;
        console.log(linebr);
        hrrows++;
        _t.totalrows++;
        let linespace = 'space1';
        //html_arr.push('<div class="el_br">'+_t.totalrows+'\n</div>');

        if(linebr > 1){
          linespace = 'space2';
          //console.log(linebr);
          //breaks = '\n\n';
          //html_arr.push('\n\n');

          //console.log(_t.totalrows);
        } else {
          breaks = '\n';
        }
        html_arr.push('<div class="el_br ' +linespace+ '">\n</div>');
        //html_arr.push(breaks);
        //console.log(breaks);
      }


      //if pagerow is at least the number of rows per page or a multiple
      if (_t.totalrows > 0 && _t.totalrows % this.rowsperpage === 0){
        console.log(hrrows);
        console.log((_t.totalrows-hrrows));
        //console.log(_t.breakcount);
        //console.log(_t.totalrows +  _t.breakcount);
        //for this hard return, create a page division, reset pagerows

      //  html_arr[i] = html_arr[i] + '<span class="pagebreak"></span>';
        html_arr[i] = this.createDivide(html_arr[i],(_t.totalrows-hrrows));
        //reset pagerows for new page
        //console.log('breaks: '+ _t.breakcount);
        _t.totalrows = 0;
      }


    });
    let html = html_arr.join('<br>');
    return html;
  }

  createDivide(hr,rows){
    console.log('here');
    console.log(hr);

    if(hr.indexOf('el_br') !== -1) return hr + '<span class="pagebreak"></span>';

    let pagebreaked =  false;
    let char = 0;
    let lines = '';
    let newrows = 0;
    //split hard return into words
    let words = hr.split(' ');
    let lbreak = '';
    let lbreak2 = '';
    let pbreak = '';
    let space = ' ';
    let prevwordtotal = 0;
    //loop through words
    console.log(words);
    words.forEach((word, idx) => {
      //console.log(char);
      lbreak = '';
      lbreak2 = '';
      pbreak = '';
      space = ' ';
      //pagebreaked = false;
      //if(idx > 0) prevwordtotal = (prevwordtotal - (word.length +1));
      prevwordtotal = this.lib.deepCopy(char);
      //count number of characters and increment by 1 for space
      for(let i = 1,len = (word.length + 1); i <= len; i++){

        //prevwordtotal++;
        char++;

        //if number of characters per row reached or multiple, add line break

        //record previous word charstotal (prevwordtotal)
        //get number of spaces left before the word which hits char threshold (charsperrow -  prevwordtotal)
        //if word length is greater than spaces, then prepend linebreak


        if(char === this.charsperrow) {
          let diff = (this.charsperrow - prevwordtotal);
          let offset = 2;
          console.log(word);
          console.log(word.length+1)
          console.log(diff+offset);
          if((word.length + 1) >= (diff+offset)){
          //if((word.length + 1) >= (diff+offset)){
            lbreak2 = '\r';
          } else{
            space = '';
            lbreak = '\r';
          }
          newrows++;  char = lbreak2 !== '' ? (word.length + 1) : 0;
          //console.log(prevwordtotal);
          //console.log('diff: ' + diff);
          //console.log('word length: ' + (word.length + 1));
          //console.log('char: ' +  char);
          //console.log('word: ' + word);

          //if number of rows per page reached, add page break
          console.log(rows+ newrows);
          if((rows + newrows) === this.rowsperpage && !pagebreaked){
            console.log('pagebreak');
            pbreak = (rows + newrows) + '<span class="pagebreak"></span>';
            //pbreak = '<span class="pagebreak"></span>';
            //char = lbreak2 !== '' ? (word.length + 1) : 0;
            pagebreaked = true;
            this.breakcount = 0;
          }

          break;

        } else {
          //console.log(pagebreaked);

          if(idx == (words.length-1) && !pagebreaked){
            console.log('reached end of words and didnt hit char limit');
            lbreak = '<span class="pagebreak"></span>';
            pagebreaked = true;
            break;
          }

        }
      }
      //append word to lines
      //lines +=  word + ' ' + char + ' ' + lbreak;
      //console.log('char: ' +  char);
      //lines +=  lbreak2 + word + ' ' + char + ' '  + lbreak;
      lines +=  lbreak2 + word + space + lbreak + pbreak;
      //lines +=  pbreak + lbreak2 + word + ' ' + char + ' ' + lbreak;
      //lines +=  lbreak + word + ' ';

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
