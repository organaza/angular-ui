import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'timestampToDate' })
export class TimeStampToDatePipe implements PipeTransform {

  static t(value: any, format: string, local: boolean = true, unix: boolean = false) {
    if (value === null) {
      return null;
    }

    if (!format) {
      format = 'LLL';
    }
    if (format === 'fromNow') {
      if (unix) {
        return moment.unix(value).fromNow();
      } else if (local) {
        return moment(value).fromNow();
      } else {
        return moment.utc(value).fromNow();
      }
    }
    let result = 'Invalid date';
    if (unix) {
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

  transform(value: any, format: string, local: boolean = true, unix: boolean = false) {
    return TimeStampToDatePipe.t(value, format, local, unix);
  }
}
