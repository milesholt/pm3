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
  //Screenplay format should always be 12pt Courier (using Courier Prime - modern rework)
  //Courier is monospace - a fixed-width - each character has identical width
  //Format of margins should right,top,bottom as 1 inch and left as 1.5 inches
  //Line height should be single spaced (1) - celtx have this as 17px?
  //total rows per page - 58 (Should be 55 approx, according to other sources??)
  //total characters per page - 3306
  //total characters per row - 57
  //total width - 547px (excluding margins)

  markup_options_fontsize = 12;
  //pageheight_12 = 827;
  //pageheight_12 = 904;
  pagewidth_12 = 547;
  //pageheight_12 = 928; //928 (58 rows - measured from downloaded pdf with 12pt courier prime 16px line height)
  //1 single space line height for 12pt is 16px - 16px x 58 rows = 928px
  //for 55 rows height is 880px (55rows x 16px)
  pageheight_12 = 880;
  markup_height = 0;

  totalrows = 0;
  elrows = 0;
  rowsperpage =  55;
  charsperrow = 57;
  chars:number = 0;
  lines:any = [];

  //pdf options
  pdf_option_margins = {
    left: "1.5in",
    right: "1in",
    top: "1in",
    bottom: "1in"
  }
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
      // if(i % eval('this.pageheight_' + this.markup_options_fontsize) === 0){
      //   this.createPageBreak(markup,i);
      // }
      if(i % eval('this.pageheight_' + this.markup_options_fontsize) === 0){
        this.createPageBreak(markup,i);
      }
    }
  }

  async createPageBreak(markup,height){
    console.log(height);
    let divider = document.createElement("hr");
        divider.classList.add("pagebreak");
        divider.style.top = height + 'px';
        markup.children[0].append(divider);
  }


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


      // let elem = document.getElementById('pdf_export_container');
      //  var response = html2canvas(elem);
      //  response.then(res => {
      //    var img = res.toDataURL();
      //    console.log(img);
      //    console.log("data:application/pdf;base64," + img);
      //  })




      //let elem = this.html;
      //let elem = document.getElementById('pdf_export_container');
      //convert html to pdf
      //data:application/pdf;base64,base64encodedpdf
      // console.log(elem);
      // let blob = new Blob([elem], {
      //   "type": "application/pdf"
      // });
      // console.log(blob);
      // let reader: FileReader = new FileReader();
      // reader.readAsDataURL(blob);


      // html2canvas(elem, {
      //         onrendered: function(canvas) {
      //         var img = canvas.toDataURL()
      //         console.log("data:application/pdf;base64," + img);
      //         //window.open(img);
      //      }
      //     });


      // reader.onload = function (evt) {
      //     console.log(evt.target);
      //     // if (<FileReader>evt.target.readyState === 2) {
      //     //     console.log(
      //     //                  // full data-uri
      //     //                  evt.target.result
      //     //                  // base64 portion of data-uri
      //     //                , evt.target.result.slice(22, evt.target.result.length));
      //     //     // window.open(evt.target.result)
      //     // };
      // };

      // reader.onloadend = (e) => {
      //    console.log(reader.result);
      //    //this.fileString = myReader.result;
      // };
      //reader.readAsDataURL(blob);



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
    let html = '<style>'+
               '.pdf_export_container *{font-size:12px!important;}'+
               '.el_s{font-weight:bold!important;text-align:left;}'+
               '.el_c{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_p{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '.el_b{font-weight:normal!important;text-align:left;}'+
               '.el_d{font-weight:normal!important;text-align:center; max-width:200px; margin: 0 auto; padding: 5px 0px;}'+
               '</style>';
    this.totalrows = 0;
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
          html += '<div class="el_b">' + this.countRows(el.value) + '</div>';
        break;
        case 'dialogue':
          html += '<div class="el_d">' + el.value + '</div><br>';
        break;
      }
      //html += await this.countRows(el);
    });
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
    console.log(html);
    return html;
  }

  countRows(el){
    //console.log(el);
    let hardreturns = el.split(/\r|\r\n|\n/);
    console.log(hardreturns);

    //let newline = '';
    //let nextline = '';
    let pagerows = 0;
    let html_arr = [];

    hardreturns.forEach((hr,i) => {

      html_arr.push(hr)

      let sr = Math.round(hr.length / this.charsperrow) + 1; //increment index by one
      console.log(sr);
      pagerows = pagerows + sr;

      if (pagerows >= this.rowsperpage){
        html_arr[i-1] = html_arr[i-1] + '<span class="pagebreak"></span>';
        pagerows = 0;
      }

    });

    let html = html_arr.join('<br>');

    console.log(pagerows);
    console.log(html);

    return html;

    // hardreturns.forEach(async hr => {
    //
    //   //let sr = Math.round(hr.length / this.charsperrow) + 1; //increment index by one
    //
    //   //split hr by spaces
    //   //let words = hr.split(' ');
    //   //for each word, count characters
    //
    //
    //   // await words.forEach(async word => {
    //   //   // chars += word.length;
    //   //
    //   //   await this.prepLines(word,newline)
    //   // });
    //   //if word goes past charperrow, collect all words on that line except last
    //   //count line as new row
    //   //append line to html
    //   //if row is past rowsperpage append pagebreak
    //   //carry last word onto new line and repeat
    //
    //
    //
    //   // for(let i=0; i < sr; i++){
    //   //   this.totalrows += 1;
    //   //   if (this.totalrows % this.rowsperpage === 0){
    //   //     r = '<span class="pagebreak"></span>';
    //   //   }
    //   // }
    //
    //   //console.log(sr);
    // });
    //
    // console.log(this.lines);


    // let rows = hardreturns.length;
    // this.elrows = 0;
    // //append hard returns
    // //this.checkReturns(el,hardreturns);
    // //calculate soft returns
    // for(let i = 0,len = rows; i < len; i++){
    //   let line = hardreturns[i];
    //   let softreturns = Math.round(line.length / this.charsperrow);
    //   //if softreturns > 0, minus by one (hard return already counted)
    //   softreturns = Math.round(softreturns > 0 ? (softreturns - 1) : 0);
    //   //append soft returns
    //   this.checkReturns(el,softreturns);
    // }
  }

  async checkReturns(el,returns){
    for(let k=0; k < returns; k++){
      this.totalrows += 1;
      this.elrows += 1;
      console.log(this.elrows);
      if (this.totalrows % this.rowsperpage === 0){
        //this.createPageBreak(el);
      }
    }
  }


  async createPageBreak(el){
    let divider = document.createElement("hr");
        divider.classList.add("pagebreak");
        divider.style.top = (this.elrows * this.lineheight) + 'px';
        el.prepend(divider);
  }

  // async prepLines(word,newline){
  //   console.log(this.chars)
  //   for(let i = 0, len = word.length; i < len; i++){
  //     this.chars++;
  //     //console.log(chars);
  //     if(this.chars < this.charsperrow){
  //       console.log('here');
  //       newline += word + ' ';
  //     } else {
  //       console.log('here2');
  //       this.lines.push(newline + '<br>');
  //       if(this.lines.length % this.rowsperpage) this.lines.push('<span class="pagebreak"></span><br>');
  //       let nextline = word + ' ';
  //       this.prepLines(word,nextline)
  //     }
  //   }
  // }

  // async checkReturns(el,returns){
  //   console.log(returns);
  //   let r = '';
  //   for(let k=0; k < returns; k++){
  //     //for each element, track elrow number and totalrows
  //
  //     //console.log(this.totalrows);
  //     this.elrows += 1;
  //     //if totalrows is multiple of rowsperpage (based on PDF width) createPagebreak
  //     if (this.totalrows % this.rowsperpage === 0){
  //       //this.createPageBreak(el,markup,charsperrow);
  //       r = '<span class="pagebreak"></span>';
  //     }
  //   }
  //   return r;
  // }

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
