import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatArrayString' })
export class FormatArrayStringPipe implements PipeTransform {

  transform(array: any, sparator: string = ', ') {
    if (!array || array.length === 0) {
      return '-';
    }
    if (Array.isArray(array)) {
      let result = array.join(sparator);
      result = result.replace('\n', '');
      result = result.replace('\t', '');
      result = result.replace(/\<.*?\>/g, '');
      return result;
    } else {
      return array;
    }
  }
}
