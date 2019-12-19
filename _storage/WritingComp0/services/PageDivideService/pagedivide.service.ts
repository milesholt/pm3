import { Injectable, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild, ElementRef, IterableDiffers, DoCheck, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { of, Observable, isObservable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Library } from '../../../../../app.library';
import { MasterService } from '../../../../../services/master.service';

@Injectable()
export class PageDivideService {

  //page divider defaults
  markup_options_fontsize = 12;
  pagewidth_12 = 547;
  pageheight_12 = 828;
  markup_height = 0;
  rowsperpage =  52;
  charsperrow = 57;
  totalrows = 0;
  breakcount = 0;

  constructor(private lib: Library, private service: MasterService) {}

  ngOnChanges(changes: SimpleChanges) {}

  ngDoCheck(){}

  ngOnInit(){}


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


  dividePages(el,value){
    //split hard returns
    let hardreturns = value.split(/\r|\r\n|\n/);
    let _t = this;
    let html_arr = [];
    //loop through hard returns
    let linebr = 0;
    hardreturns.forEach((hr,i) => {
      let hrrows = 0;
      //if hard return element contains text
      if(hr !== ''){
        linebr = 0;
        //for each hard return, get number of soft returns / rows
        let sr:any = this.checkSoftReturns(hr);
        //loop through soft returns
        for(let  j =0, len = sr; j < len; j++){
          //increment total rows for each return
          _t.totalrows++;
          hrrows++;
          //if totla rows greater than 0 and reaches total rows per page
          if (_t.totalrows > 0 && _t.totalrows % this.rowsperpage === 0){
            //create a divide for select hard return element
            hr = this.createDivide(hr,(_t.totalrows-hrrows));
            _t.totalrows = 0;
          }
        }
        //append hr to HTML array
        html_arr.push(hr);
      } else {
        //if not the return, count as line break
        linebr++;
        //styling reference point as single space
        let linespace = 'space1';
        //determine if this break is at the end of the HR element, as a styling reference point
        let endspace = i >= (hardreturns.length-2) ? 'end' : '';
        //if key is not a character element, count as a new row, to get correct number of rows
        if(el.key !== 'c'){
          hrrows++;
          _t.totalrows++;
        }
        //if more than one break in a row, count as double space
        if(linebr > 1) linespace = 'space2';
        html_arr.push( (el.key !== 'c' ? '&nbsp;' : '') + '<br class="el_br ' +linespace+ ' ' +endspace+ '" />');
      }
      //if pagerow is at least the number of rows per page or a multiple
      if (_t.totalrows > 0 && _t.totalrows % this.rowsperpage === 0){
        html_arr[i] = this.createDivide(html_arr[i],(_t.totalrows-hrrows));
        _t.totalrows = 0;
      }
    });
    //convert HTML array into HTML string.
    let html = html_arr.join('\n');
    return html;
  }

  checkSoftReturns(hr){
    let words = hr.split(' ');
    let char = 0;
    let newrows = 0;
     //loop through words
     words.forEach((word, idx) => {
      //foreach word, loop through their chars, plus one for space after word
      for(let i = 1,len = word.length+1; i <= len; i++){
        char++;
        //if char total equals characters per row
        if(char === this.charsperrow) {
          //if word reaches threshold move to new line
          char = i >= 1 && this.lib.isDefined(word[i-1]) && word[i-1] !== '' && (i < word.length) ? i : 0;
          newrows++;
        }
      }
      //any remaining characters will be another (the last) line.
      if(idx == (words.length-1)) if(char > 0) newrows++;
    });
    return newrows;
  }

  createDivide(hr,rows){
    //return hr if it is a line break
    if(hr.indexOf('el_br') !== -1) return hr + '<span class="pagebreak"></span>';
    //set default paramters
    let pagebreaked =  false;
    let prevwordtotal =0; let char = 0; let newrows = 0;
    let lines = ''; let rbreak = ''; let lbreak = ''; let pbreak = '';
    let space = ' ';
    //split hard return into words
    let words = hr.split(' ');
    //loop through words
    words.forEach((word, idx) => {
      //for each loop reset parameters
      rbreak = lbreak = pbreak = '';
      space = ' ';
      //record previous word charstotal (prevwordtotal)
      prevwordtotal = this.lib.deepCopy(char);
      //count number of characters and increment by 1 for space
      for(let i = 1,len = (word.length + 1); i <= len; i++){
        char++;
        //if number of characters per row reached or multiple, add line break
        if(char === this.charsperrow) {
          //get number of spaces left before the word which hits char threshold (charsperrow -  prevwordtotal)
          let diff = (this.charsperrow - prevwordtotal);
          let offset = 2;
          //if word length is greater than spaces, then prepend linebreak
          if((word.length + 1) >= (diff+offset)){
            lbreak = '\r';
          } else{
            space = '';
            rbreak = '\r';
          }
          //append row, if lbreak contains return meaning new line, reset char to 0
          newrows++;  char = lbreak !== '' ? (word.length + 1) : 0;
          //if number of rows per page reached, add page break
          if((rows + newrows) === this.rowsperpage && !pagebreaked){
            pbreak = '<span class="pagebreak"></span>';
            pagebreaked = true;
            //reset page break count
            this.breakcount = 0;
          }
          break;
        } else {
          //if we have reached the total number of words and still no page break, add one.
          if(idx == (words.length-1) && !pagebreaked){
            rbreak = '<span class="pagebreak"></span>';
            pagebreaked = true;
            break;
          }

        }
      }
      //put together the line with necessary breaks
      lines +=  lbreak + word + space + rbreak + pbreak;
    });
    return lines;
  }

}
