import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns a formatted value for the writing component.
*/
@Pipe({
  name: 'elformat',
  pure: true
})
export class ElFormatPipe implements PipeTransform {
  transform(value: any, format: string, event: any): string {

    let v:string = value;

    switch(format){
      case 'parenthetical':
       v = '(' + value.replace(/[()]/g, '') + ')';
      break;
    }

    return v;
  }
}
