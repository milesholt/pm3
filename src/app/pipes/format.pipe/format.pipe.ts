import { Pipe, PipeTransform } from '@angular/core';
/*
 * Returns a verified string
 * Removes any whitespace in the string, also converts value to string.
 * This could be extended to include other formats, other than string.
*/
@Pipe({name: 'format'})
export class FormatPipe implements PipeTransform {
  transform(value: any, format: string): string {

    switch(format){
      case 'string':
        value.toString().trim();
      break;
      case 'list':
        value.toString().split('c');
      break;
      case 'number':
        value = Number(value.replace(/\,/g,''));
      break;
      case 'json':
        value = JSON.parse(value);
      break;
      case 'array':
        value = value.split(',');
      break;
    }

    return value;
  }
}
