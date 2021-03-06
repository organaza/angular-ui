import { Pipe, PipeTransform } from '@angular/core';
import { Strings } from '../string/string';

@Pipe({ name: 'parseBool', pure: false })
export class ParseBooleanPipe implements PipeTransform {
  transform(value: string | number | boolean): boolean {
    return Strings.parseBoolean(value);
  }
}
