import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'durationToString' })
export class DurationToStringPipe implements PipeTransform {

  transform(value: any, format: any) {
    if (value === null) {
      return '-';
    }
    value = moment.duration(value, 's');

    if (!format) {
      const str: string[] = [];
      if (Math.floor(value.asDays()) > 0) {
        let hours = Math.floor(value.asDays()) * 24;
        if (value.hours() > 0) {
          hours += value.hours();
        }
        str.push(moment.localeData().relativeTime(hours, true, 'hh', false));
      } else if (Math.floor(value.asHours()) > 0) {
        str.push(moment.localeData().relativeTime(Math.floor(value.asHours()), true, 'hh', false));
        if (value.minutes() > 0) {
          str.push(moment.localeData().relativeTime(value.minutes(), true, 'mm', false));
        }
      } else if (Math.floor(value.asMinutes()) > 0) {
        str.push(moment.localeData().relativeTime(Math.floor(value.asMinutes()), true, 'mm', false));
      } else if (Math.floor(value.asSeconds()) > 0) {
        str.push(moment.localeData().relativeTime(Math.floor(value.asSeconds()), true, 's', false));
      }

      if (str.length === 0) {
        str.push('-');
      }
      return str.join(' ');
    } else {
      if (format === 'days') {
        return moment.localeData().relativeTime(Math.floor(value.asDays()), true, 'dd', false);
      }
      if (format === 'hours') {
        return moment.localeData().relativeTime(Math.floor(value.asHours()), true, 'hh', false);
      }
      if (format === 'hoursOnlyNumber') {
        return Math.floor(value.asHours());
      }
      if (format === 'minutes') {
        return moment.localeData().relativeTime(Math.floor(value.asMinutes()), true, 'mm', false);
      }
      if (format === 'number') {
        return value.asMinutes();
      }
    }
  }

}
