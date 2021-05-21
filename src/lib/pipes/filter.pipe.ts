import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  static t<T>(value: Array<T>, search: string, fields: string[]): Array<T> {
    if (Array.isArray(value)) {
      return value.filter((v) => {
        if (fields) {
          for (const f of fields) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              return v[f].toLowerCase().indexOf(search.toLowerCase()) > -1;
            } catch (e) {
              return false;
            }
          }
        } else {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            return (
              v.toString().toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          } catch (e) {
            return false;
          }
        }
        return false;
      });
    }
    return [];
  }
  transform<T>(value: Array<T>, search: string, fields: string[]): Array<T> {
    return FilterPipe.t(value, search, fields);
  }
}
