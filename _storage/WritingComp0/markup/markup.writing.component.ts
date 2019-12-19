import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, QueryList, ViewEncapsulation, ViewChild, ViewChildren, ElementRef, IterableDiffers, DoCheck, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonInput, IonTextarea, Platform } from '@ionic/angular';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../app.library';
import { MasterService, ModalService } from '../../../../services/master.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { NodeModel } from '../../../../models/node.model';
import { ItemModel } from '../../../../models/item.model';

import { FormComponent } from '../../../../components/core/FormComp/form.component';

//Component specific services
import { PageDivideService } from '../services/PageDivideService/pagedivide.service';
import { SegmentsWritingModalComponent } from '../segments/segments.modal/segments.writing.modal.component';
//import { FountainParseService } from '../services/FountainParseService/fountainparse.service';

import * as html2canvas from "html2canvas"
import xml2js from 'xml2js';

import {  PdfjsControl } from '@hhangular/pdfjs';


declare function fountain(arg:string,callback:any ): any;
//declare var fs:any = require('fs');

@Component({
  selector: 'comp-writing-markup',
  templateUrl: './markup.writing.component.html',
  styleUrls: ['./markup.writing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MasterService, ModalService]
})
export class MarkupWritingComponent implements OnInit, OnChanges, DoCheck {

  @Input() master: any = {};
  @Output() callback = new EventEmitter();
  @ViewChild('pdf', {static: false}) pdf: any;
  @ViewChild('iframe', {static: false}) previewFrame: ElementRef;
  //@ViewChildren('elinput')  inputElements: QueryList<IonInput>;
  @ViewChildren('elinput') inputElements: QueryList<ElementRef>;
  @ViewChildren('eltextarea')  textElements: QueryList<IonTextarea>;


  parseString = require('xml2js').parseString;
  public xmlItems : any;

  pdfjsControl: PdfjsControl = new PdfjsControl();
  pdfPage:any;

  //clear any selection when clicking anywhere on the document
  // @HostListener('document:click', ['$event']) documentClick(event) {
  //   //this.selection = [];
  // }

  //disable default Tab key functionality
  @HostListener('document:keydown.tab', ['$event']) keydownTab(event: KeyboardEvent) {
    event.preventDefault();
    this.changeElement();
  }

  @HostListener('document:keydown.shift', ['$event']) keydownShift(event: KeyboardEvent) {
    event.preventDefault();
    this.isshift = true;
  }

  @HostListener('document:keyup.shift', ['$event']) keyupShift(event: KeyboardEvent) {
    event.preventDefault();
    this.isshift = false;
  }

  @HostListener('document:keydown', ['$event']) keydownShiftEnter(event: KeyboardEvent) {
    //console.log(event);
    if (event.shiftKey && event.keyCode == 13) {
      this.createElement('body');
    }
  }

  @HostListener('keydown', ['$event']) keydownReturn(event: KeyboardEvent) {
    if(event.shiftKey && event.keyCode == 8){
      if((this.currentel.id-1) >= 0){
        console.log(this.currentel);
        this.editElement('delete',this.currentel,this.currentel.id);
        this.selectEl((this.currentel.id-1));
      }
    }
  }

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
  private itemModel: ItemModel = new ItemModel();
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
  isshift:boolean = false;
  params:any = {};
  def:any;

  //markup and elements
  lastidx = 0;
  currentel:any;
  currentelid:number;

  //Segments
  currentSegment:number = 0;
  // segment:any = {id: 0, name: '', tags: [], selection:[]};
  segment:any = {};
  newsegment:any = {};
  maxsegmentid:number = 0;
  selection:any = [];
  segments:any = [];
  isBeginSegment:boolean = false;

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

  constructor(private lib: Library, private service: MasterService, differs: IterableDiffers, private pageDivide: PageDivideService,  public http : HttpClient, private platform: Platform,) {
    this.differ = differs.find([]).create(null);
    this.def = service.getDefinitions();
  }



  ngOnChanges(changes: SimpleChanges) {}

  ngDoCheck(){
    const markupchange = this.differ.diff(this.markup);
    if(markupchange !== null) {
      console.log('markup changed');
      setTimeout((() => {
          this.updateMarkup();
      }).bind(this), 200);
    }
  }

  ngOnInit() {
    this.markup = this.master.markup[this.draft];
    let markup =  <HTMLElement>document.querySelectorAll('.markup_editor')[0];
    this.markup_height =  markup.clientHeight;
    this.readyMarkup();
    //myMethod();
    //console.log('test');
    //console.log(this.fs);
  }



  /* On Resize */

  async onResizeDeviceCheck(markup){
    if(markup.clientWidth >= 1200) this.device = 'desktop';
    if((markup.clientWidth < 1200) && (markup.clientWidth > 690)) this.device = 'tablet';
    if(markup.clientWidth <= 690) this.device = 'mobile';
  }

  /* Specific component functions */

  readyMarkup(){
    if ((this.markup.length-1) < 0) this.createElement('s');
    this.lastidx = (this.markup.length-1);
    console.log(this.lastidx);
    //focus last element
    this.focusElement(this.lastidx);
  }

  //Area / selection
  // selectArea(idx){
  //   console.log(idx);
  //   if(this.selection.indexOf(idx) === -1)  this.selection.push(idx);
  //   // if(this.selection.length === 0 && !this.shift){
  //   //   this.selection.push(idx);
  //   // }
  //   // if(this.shift){
  //   //   this.selection.push(idx);
  //   //   this.allowSegment = true;
  //   // }
  //
  // }

  // clearArea(e){
  //   console.dir(e.target);
  //   if(e.target !== e.currentTarget) return;
  //   console.log('clearing area');
  // }

  //Elements
  changeElement(el:any=false){
    let list = this.lib.deepCopy(this.master.elements);
    let listarr = Object.keys(list);
    let pos =  listarr.indexOf(this.currentel.key);
    let newpos = !el ? pos++ >= (listarr.length-1) ? 0 : pos++ : listarr.indexOf(el);
    let val = this.lib.isProperty(this.currentel.value, 'name') ? this.currentel.value.name.value : this.currentel.value;
    this.currentel.key = list[listarr[newpos]].key;
    this.currentel.type = list[listarr[newpos]].type;
    if(this.currentel.type == 'textarea') this.currentel.value = val;
    if(this.currentel.type !== 'textarea') {
      this.currentel.value = this.lib.deepCopy(this.itemModel.document);
      this.currentel.value.name.value = val;
    }
  }

  selectEl(idx){
    this.currentelid = idx;
    this.currentel = this.markup[idx];
    this.focusElement(idx);
  }

  focusElement(idx){
    setTimeout(()=>{
      let element = <HTMLElement>document.querySelectorAll('.el-'+idx)[0].children[2].children[0].children[0];
      if(element.nodeName == 'ION-TEXTAREA') this.textElements.last.setFocus();
      if(element.nodeName == 'INPUT') setTimeout(()=>{ this.inputElements.last.nativeElement.focus(); },300);
    });
  }

  createElement(el:string){
    let nel = this.lib.deepCopy(this.master.elements[el]);
    nel.id = this.service.items.getNewId(this.markup);
    this.markup.push(nel);
    this.lastidx = (this.markup.length-1);
    this.selectEl(this.lastidx);
  }

  updateElement(el,idx,val,elpath){
    const v = val !== '' ? val : eval('el.' + elpath);
    eval('el.' + elpath + ' = v');
    this.input = this.lib.deepCopy(v);
    this.checkGroups(el);
    this.selectEl(idx);
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

    console.log('updating markup');

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




 //IMPORTS

 //Import pdf
 //Uses PDFjs to get PDF data
 async importMarkup_PDF(){
   let pdfPage:any;
   this.pdfjsControl.load('/assets/pdf/test.pdf').then(r =>{
      let pagenumbers = r;
      let pages = this.pdfjsControl.getPdfPages();
      let doc = this.pdfjsControl.items[0].documentProxy;
      doc.getPage(1).then(page =>{
        page.getTextContent().then(obj => {
          console.log(obj);
          this.parseMarkup_PDF1(obj)
          .then((data)=>
          {
             this.draft = 0;
             this.markup = data[this.draft];
          });
        });
      });
   });
 }

  //STEP1
  //First step of parsing PDF data. We call Step2, and once loop is complete, we send the data
  //to step3, before being passed back and added to the markup
   async parseMarkup_PDF1(obj){
     return new Promise(async resolve =>
     {
       var i=0, narr = [];
       await this.parseMarkup_PDF2(i,obj.items, narr);
       this.parseMarkup_PDF3(narr)
       .then((data)=> { resolve(data); });
     });
   }

  //STEP2
  //This takes the array from PDF.js and formats it so that it can be parsed correctly.
  //PDF.js has every line as an item within the array.
  //This step combines items which are matching by type, using parseMarkup_PDF_itemMatch function.
  async parseMarkup_PDF2(i,items,narr){
     var  item = items[i],
          value = item.str,
          i2 = parseInt(i)+1;
          //Determine if we have finished loop by hitting an undefined item
          if(items[i2] !== undefined){
            //If current item and next item match, combine them as one
            if(this.parseMarkup_PDF_itemMatch(item, items[i2])){
              item.str = value + '\n' + items[i2].str;
              //Delete duplicate next item, as we have combined it to the current
              items.splice(i2,1);
              this.parseMarkup_PDF2(i,items,narr);
            } else {
              //If item doesn't match, add as new item and continue
              item.str = this.lib.removeLineBreaks(item.str);
              narr.push(item);
              i++;
              this.parseMarkup_PDF2(i,items,narr);
            }
          } else{
            //Loop complete, return new array
            return narr;
          }
   }

  //STEP3
  //This is where the correctly formatted PDF array is converted into an array the markup can work with.
   async parseMarkup_PDF3(obj){
     return new Promise(resolve =>
     {
       var k,
           arr = { 0 : [] };

       for(k in obj){
         var  item = obj[k],
              value = item.str,
              pos = item.transform[4],
              el = {},
              pcheck = /(\([A-Z]{2}\))/;

         //Scene Heading
         if(pos == 108 && value === value.toUpperCase()) el = { "key": "s", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
         //Action
         if(pos == 108 && value !== value.toUpperCase()) el = { "key": "body", "value": value, "type": "textarea", "id": k };
         //Character
         if(pos === 243) el = { "key": "c", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
         //Dialogue
         if(pos === 171) el = { "key": "dialogue", "value": value, "type": "textarea", "id": k };
         //Parenthetical
         if(pos === 200) el = { "key": "p", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };

         if(Object.keys(el).length) arr[0].push(el);
       }
       resolve(arr);
     });
   }

  //Determine if an item in the PDF data matches with the next item, in terms of type.
  //It determines the type by the text position and whether it is in capitals or not (ie. Headings)
   parseMarkup_PDF_itemMatch(item1,item2){
     var r =false,
         pos1 = item1.transform[4],
         pos2 = item2.transform[4],
         val1 =  item1.str,
         val2 =  item2.str;
     if(pos1 === pos2) r = true;
     if(val1 === val1.toUpperCase()) if(val2 !== val2.toUpperCase()) r = false;
     return r;
   }


  //Import FDX - Final Draft

  async importMarkup_FDX(){
    this.http.get('assets/xml/test.fdx.xml',
      {
        headers: new HttpHeaders()
        .set('Content-Type', 'text/xml')
        .set('Content-Encoding', 'gzip')
        .append('Access-Control-Allow-Methods', 'GET')
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType:'text'
      })
      .subscribe((data)=>
      {
         this.parseMarkup_FDX(data)
         .then((data)=>
         {
            this.draft = 0;
            this.markup = data[this.draft];
            console.log(this.markup);
         });
      });

    //test xml as toString
    // var data = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><FinalDraft DocumentType="Script" Template="No" Version="1"><Content><Paragraph Number="1" Type="Scene Heading"><SceneProperties Title=""/><Text>INT.HOME - NIGHT</Text></Paragraph><Paragraph Type="Action"><Text>Here is one line. Then another.</Text></Paragraph></Content></FinalDraft>';
    // this.parseMarkup_FDX(data)
    //      .then((data)=>
    //      {
    //         this.draft = 0;
    //         this.markup = data[this.draft];
    //         console.log(this.markup);
    //      });
  }

  async parseMarkup_FDX(data)
   {
      return new Promise(resolve =>
      {
         var k,
             arr    = { 0 : [] },
             parser = new xml2js.Parser(
             {
                trim: true,
                explicitArray: true
             });

         parser.parseString(data, function (err, result)
         {
            var obj = result.FinalDraft.Content[0].Paragraph;
            const _t = this;

            for(k in obj)
            {

               var item = obj[k];
               var type = item.$.Type;
               var value = item.Text[0];
               var el = {};

               switch(type){
                 case 'Action':
                   el = { "key": "body", "value": value, "type": "textarea", "id": k };
                 break;
                 case 'Dialogue':
                   el = { "key": "dialogue", "value": value, "type": "textarea", "id": k };
                 break;
                 case 'Character':
                   el = { "key": "c", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
                 break;
                 case 'Parenthetical':
                   el = { "key": "p", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
                 break;
                 case 'Scene Heading':
                   el = { "key": "s", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
                 break;
               }
               if(Object.keys(el).length) arr[0].push(el);
            }

            resolve(arr);
         });
      });
   }

   //Import Fountain

   importMarkup_Fountain(){
     console.log('importing fountain');
     const _t = this;
     this.http.get('assets/fountain/test.fountain',
       {
         headers: new HttpHeaders()
         .set('Content-Type', 'text/plain')
         .append('Access-Control-Allow-Methods', 'GET')
         .append('Access-Control-Allow-Origin', '*')
         .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
         responseType:'text'
       })
       .subscribe((data)=>
       {
         fountain(data, function (output) {
            //console.log(output.tokens);
            _t.parseMarkup_Fountain(output.tokens)
            .then((data)=>
            {
               _t.draft = 0;
               _t.markup = data[_t.draft];
               console.log(_t.markup);
            });
          });
       });

   }

   parseMarkup_Fountain(data){
     return new Promise(resolve =>
     {
       var k,
           arr    = { 0 : [] };
       for(k in data)
       {
         console.log(data[k]);
         var item = data[k];
         var type = item.type;
         var value = item.text;
         var el = {};
         switch(type){
           case 'action':
             el = { "key": "body", "value": value, "type": "textarea", "id": k };
           break;
           case 'dialogue':
             el = { "key": "dialogue", "value": value, "type": "textarea", "id": k };
           break;
           case 'character':
             el = { "key": "c", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
           break;
           case 'parenthetical':
             el = { "key": "p", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
           break;
           case 'scene_heading':
             el = { "key": "s", "value": { "name": { "value": value, "type": "text" }, "desc": { "value": "", "type": "text" } }, "type": "string", "id": k, "gid": 0 };
           break;
         }
         if(Object.keys(el).length) arr[0].push(el);
       }
       resolve(arr);
     });
   }


  //EXPORTS

  //Export FDX

  exportMarkup_FDX(){
    console.log(this.markup);
    var si = 1;
    var xml:string = '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><FinalDraft DocumentType="Script" Template="No" Version="1"><Content>';
    this.markup.forEach((el,i) =>{
      var item:string = '';
      switch(el.key){
        case's':
          item = '<Paragraph Number="'+si+'" Type="Scene Heading"><SceneProperties Title=""/><Text>'+el.value.name.value+'</Text></Paragraph>';
          si++;
        break;
        case 'p':
          item = '<Paragraph Type="Parenthetical"><Text>'+el.value.name.value+'</Text></Paragraph>';
        break;
        case 'c':
          item = '<Paragraph Type="Character"><Text>'+el.value.name.value+'</Text></Paragraph>';
        break;
        case 'dialogue':
          item = '<Paragraph Type="Dialogue"><Text>'+this.lib.removeLineBreaks(el.value)+'</Text></Paragraph>';
        break;
        case 'body':
          item = '<Paragraph Type="Action"><Text>'+this.lib.removeLineBreaks(el.value)+'</Text></Paragraph>';
        break;
      }
      if(item.length) xml += item;
    });
    xml += '</Content></FinalDraft>';
    console.log(xml);
    let mime:string = 'text/xml';
    let name = 'test4.fdx';
    this.service.file.downloadBlob(name, xml, mime);
  }

  //Export Fountain
  exportMarkup_Fountain(){
    console.log(this.markup);
    var si = 1;
    var str:string = '====\n\n';
    this.markup.forEach((el,i) =>{
      var item:string = '';
      switch(el.key){
        case's':
          item = el.value.name.value+'\n\n';
          si++;
        break;
        case 'p':
          item = el.value.name.value+'\n';
        break;
        case 'c':
          item = el.value.name.value+'\n';
        break;
        case 'dialogue':
          item = this.lib.removeLineBreaks(el.value)+'\n\n';
        break;
        case 'body':
          item = this.lib.removeLineBreaks(el.value)+'\n\n';
        break;
      }
      if(item.length) str += item;
    });
    str += '';
    let mime:string = 'text/plain';
    let name = 'test4.fountain';
    this.service.file.downloadBlob(name, str, mime);
  }


  //Export PDF

  async previewMarkup_PDF(){
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

  async exportMarkup_PDF(){
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

  //Segments

  beginSegment(idx){
   // this.newsegment = this.lib.deepCopy(this.segment);
   // this.newsegment.selection.push(idx);
   this.selection.push(idx);
   this.isBeginSegment = true;
   this.selectEl(idx);
  }

  endSegment(idx){
   //this.newsegment.selection.push(idx);
   this.selection.push(idx);
  }

  async saveSegment(idx){
   const d = await this.openModal('segment','segment');
   let newsegment = this.lib.deepCopy(d.data.modalData);
   this.maxsegmentid++;
   newsegment.id = this.maxsegmentid;
   newsegment.fields.selection.value = this.lib.deepCopy(this.selection);
   this.segments.push(newsegment);
   this.currentel.segment = newsegment.id;
   this.currentel.segments = [];
   this.currentel.segments.push(newsegment.id);
   setTimeout(()=>{
     this.markup[this.currentelid] = this.currentel;
     console.log(this.markup[this.currentelid]);
     this.updateMarkup();
     this.newsegment = [];
   },);
  }

  cancelSegment(){
    this.selection = [];
    this.isBeginSegment = false;
  }

  selectSegment(idx){
    this.currentSegment = idx;
    this.currentel.segment = idx;
  }

  duplicateSegment(idx){
    this.segments.forEach((seg,i) => {
      if(seg.id == idx){
        this.maxsegmentid++;
        this.newsegment = this.lib.deepCopy(this.segments[i]);
        this.newsegment.id = this.maxsegmentid;
        this.segments.push(this.newsegment);
        this.currentel.segments.push(this.maxsegmentid);
      }
    });
  }

  deleteSegment(idx){
    this.currentel.segments.forEach((seg,i) => {
      if(seg.id === idx) this.currentel.segments.splice(i,0);
    });
    this.segments.forEach((seg,i) => {
      if(seg.id === idx) this.currentel.segments.splice(i,0);
    });
  }

  async changeSegment(){
    //component to be specific segment modal, like with Groups
    const comp = SegmentsWritingModalComponent ;
    let segids = this.currentel.segments;
    let data = [];
    segids.forEach(id => {
      this.segments.forEach(segment => {
        if(segment.id == id) data.push(segment);
      });
    });
    console.log(segids);
    console.log(this.segments);
    console.log(data);
    const d = await this.openModal('segment','segment', comp, false, data);
    //console.log(d.data.modalData);
  }

  //Text Resize

  autoGrowTextZone(e) {
    e.style.height = "0px";
    //e.style.height = (e.scrollHeight + 25)+"px";
    e.style.height = (e.scrollHeight)+"px";
  }

  /* Key internal component functions and services */

  //Launch modal
  async openModal(def:string = '', model:string = '', comp:any = FormComponent, isNew:boolean = true, data:any = false){
    let fields:any = isNew ? this.lib.deepCopy(this.itemModel[model]) : data;
    this.params.modalData = isNew ? this.service.compile.prepareData(this.def[def], fields, false) : data;
    const res:any = await this.service.modal.openModal(this,comp);
    this.service.compile.compileData(res.data.modalData, fields);
    return res;
  }

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
