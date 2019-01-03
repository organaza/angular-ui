import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, search: string, fields: string[]): any {
    if (Array.isArray(value)) {
      return value.filter(v => {
        if (fields) {
          for (const f of fields) {
            try {
              return v[f].toLowerCase().indexOf(search.toLowerCase()) > -1;
            } catch (e) {
              return false;
            }
          }
        } else {
          try {
            return v.toLowerCase().indexOf(search.toLowerCase()) > -1;
          } catch (e) {
            return false;
          }
        }
      });
    }
    return [];
  }

}
