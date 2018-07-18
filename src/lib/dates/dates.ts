import moment from 'moment';

export class DateUtils {
  static parseRelative(value: string, type: 'from' | 'to' | '' = ''): moment.Moment {
    const relativeTimeRe = /(([-+]\d*)\s*(m|M|y|h|d|w)|now)\/?(m|M|y|h|d|W)?/;
    const parsed = relativeTimeRe.exec(value);
    if (!parsed) {
      return moment('Invalid date');
    }
    let date;
    if (parsed[1] === 'now') {
      date = moment();
    }
    if (parsed[1] && parsed[3]) {
      date = moment();
      date = date.add(Number(parsed[2]), parsed[3] as moment.DurationInputArg2);
    }
    if (parsed[4] && type === 'from') {
      date = date.startOf(parsed[4] as moment.unitOfTime.StartOf);
    }
    if (parsed[4] && type === 'to') {
      date = date.endOf(parsed[4] as moment.unitOfTime.StartOf);
    }
    if (!date) {
      return moment('Invalid date');
    }
    return date;
  }
}
