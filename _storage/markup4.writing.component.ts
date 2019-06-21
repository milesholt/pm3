import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild, ElementRef, IterableDiffers, DoCheck, HostListener } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class MarkupWritingComponent implements OnInit, OnChanges, DoCheck {

  @Input() master: any = {};
  @Output() callback = new EventEmitter();
  @ViewChild('pdf') pdf: any;
  @ViewChild('iframe') previewFrame: ElementRef;

  @HostListener('window:resize', ['$event']) onScrollEvent(e){
    //console.log(e);
    if(!this.pdfPreview) this.updateMarkup();
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

  pagelimit = 705;
  rowsperpage = 52; //based on line height at default 12px
  charsperrow = 66; //based on font size at default 12px
  fontsize = 7; //for some reason 8 represents the fontsize of 12px
  lineheight = 12;
  margins = 128; //default 64px * 2
  pagewidth = 545; //pdf container  - margins (673 - 128)
  pageheight = 624; //52 rows * 12px line height (default)
  totalrows = 0;
  elrows = 0;

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

    /****** Do pagebreaks ******/
    await this.clearPageBreaks(markup);
    await this.addPageBreaks(markup);

  }

  async clearPageBreaks(markup){
    for (var i = 0, len = markup.children.length; i < len; i++) {
      let el = markup.children[i];
      for (var j = 0, len2 = el.children.length; j < (len2-1); j++) {
        let el_child = el.children[j];
        if(el_child.classList.contains('pagebreak')){
           el_child.remove();
        }
      }
    }
  }


  /*
  determine markup clientWidth
  determine charsperrow based on clientWidth
  determine total rows
  loop through Elements
  for each element, track elrow number and totalrows
  if totalrows is multiple of rowsperpage go to createPagebreak
  get difference between rowsperpage and totalrows
  determine if difference is greater or less
  then increase or decrease difference from elrows * lineheight
  */


  /*
  determine markup clientWidth
  determine charsperrow based on clientWidth
  determine total rows
  loop through Elements
  for each element, track elrow number and totalrows
  if totalrows is multiple of rowsperpage go to createPagebreak
  get difference between newcharsperrow and charperrow
  divide clientiwdth by diffcharperrow to get newrows
  then increase or decrease difference from elrows * lineheight
  */

  async addPageBreaks(markup){
    this.totalrows = 0;

    //  determine markup clientWidth
    //  determine charsperrow based on clientWidth
    //get characters per row based on markup width / fontsize
    let charsperrow = Math.round(markup.clientWidth / this.fontsize);

    //loop through Elements
    for (var i = 0; i < markup.children.length; i++) {
        let el = markup.children[i];
        //console.log(el.style);
        console.log(el);
        //get hard returns
        let hardreturns = el.textContent.split(/\r|\r\n|\n/);
        let rows = hardreturns.length;
        this.elrows = 0;
        //append hard returns
        this.checkReturns(el,hardreturns,markup,charsperrow);
        //calculate soft returns
        for(let i = 0,len = rows; i < len; i++){
          let line = hardreturns[i];
          let softreturns = Math.round(line.length / charsperrow);
          //if softreturns > 0, minus by one (hard return already counted)
          softreturns = Math.round(softreturns > 0 ? (softreturns - 1) : 0);
          //append soft returns
          this.checkReturns(el,softreturns,markup,charsperrow);
        }
        //depending on element, add an extra break
        if(i < markup.children.length-1 && ['s','dialogue','body'].includes(el.classList[2])) this.totalrows += 1;
    }
  }

  async checkReturns(el,returns,markup,charsperrow){
    for(let k=0; k < returns; k++){
      //for each element, track elrow number and totalrows
      this.totalrows += 1;
      //console.log(this.totalrows);
      this.elrows += 1;
      //if totalrows is multiple of rowsperpage (based on PDF width) createPagebreak
      if (this.totalrows % this.rowsperpage === 0){
        this.createPageBreak(el,markup,charsperrow);
      }
    }
  }


  async createPageBreak(el,markup,newcharsperrow){

    console.log('--------------------------------');

    //get difference between rowsperpage and totalrows
    // let diff = this.totalrows - this.rowsperpage;
    //
    // console.log('totalrows: ' + this.totalrows);
    // console.log('rowsperpage: ' + this.rowsperpage);
    // console.log('diff: ' + diff);
    //
    // //then sum difference from elrows * lineheight
    // let diffrows = ((this.elrows + diff) * this.lineheight);
    //
    // console.log('elrows:' + this.elrows);
    // console.log('diffrows: ' + diffrows + 'px');

    //get difference between newcharsperrow and charperrow
    let newcharsperrow2 = Math.round(markup.clientWidth / this.fontsize);
    let diffchars = Math.abs(this.charsperrow - newcharsperrow2);
    console.log('diffchars: ' + diffchars);
    //divide clientiwdth by diffcharperrow to get newrows
    let newrows = Math.round(markup.clientWidth / diffchars);
    let diffrows =  Math.abs(newrows - this.rowsperpage);
    console.log('clientwith: ' + markup.clientWidth);
    console.log('pagewidth: ' + this.pagewidth);
    console.log('diffrows: ' + (markup.clientWidth < this.pagewidth  ? '+' : '-') + diffrows);
      console.log('elrows: ' + this.elrows);
    //then increase or decrease difference from elrows * lineheight
    let pos = (eval(this.elrows + (markup.clientWidth < this.pagewidth  ? '+' : '-') + diffrows) * this.lineheight);
    console.log('pos: ' + pos);


    let divider = document.createElement("hr");
        divider.classList.add("pagebreak");
        divider.style.top =  pos + 'px';
        el.prepend(divider);
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
