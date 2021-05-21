import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'timestampToDate' })
export class TimeStampToDatePipe implements PipeTransform {
  static t(
    value: moment.MomentInput,
    format?: string,
    local: boolean = true,
    unix: boolean = false,
  ): string {
    if (value === null) {
      return null;
    }

    if (!format) {
      format = 'LLL';
    }
    if (format === 'fromNow') {
      if (unix && typeof value === 'number') {
        return moment.unix(value).fromNow();
      } else if (local) {
        return moment(value).fromNow();
      } else {
        return moment.utc(value).fromNow();
      }
    }
    let result = 'Invalid date';
    if (unix && typeof value === 'number') {
      result = moment.unix(value).format(format);
    } else if (local) {
      result = moment(value).format(format);
    } else {
      result = moment.utc(value).format(format);
    }
    if (result === 'Invalid date') {
      return '---';
    } else {
      return result;
    }
  }

  transform(
    value: moment.MomentInput,
    format?: string,
    local: boolean = true,
    unix: boolean = false,
  ): string {
    return TimeStampToDatePipe.t(value, format, local, unix);
  }
}
