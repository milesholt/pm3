import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, input: string, path:any = false) {
      if (input) {
          input = input.toLowerCase();
          if(Array.isArray(value) && value.constructor === Array){
            return value.filter(el => eval('el' + (!!path ? '.' + path : '')).toLowerCase().indexOf(input) === 0);
          }
      }
      return value;
  }
}
