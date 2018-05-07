import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChange,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import moment from 'moment';

export interface CalendarDay {
  date: moment.Moment;
  label: string;
  today: boolean;
  isoweekday: number;
  selected: boolean;
  selectedStart: boolean;
  selectedEnd: boolean;
  overflow: boolean;
  holiday: boolean;
  period: boolean;
}

@Component({
  selector: 'oz-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input()
  hideOverflow: boolean;

  @Input()
  selectionStart: any;

  @Input()
  selectionEnd: any;

  @Input()
  holidays: any;

  @Output()
  change: EventEmitter<{}> = new EventEmitter();

  @Input()
  currentYear: number = moment.utc().year();

  @Input()
  currentMonth: number = moment.utc().month();

  dateCells: CalendarDay[];
  weekCells: CalendarDay[][];
  weekdays: string[];

  selectionStartMoment: moment.Moment;
  selectionEndMoment: moment.Moment;

  currentState = 'month';

  months: string[];
  years: number[];
  currentEra: string;

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
  ) {

  }
  render() {
    if (this.currentMonth === null || this.currentMonth === undefined) {
      this.currentMonth = moment.utc().month();
    }
    if (this.currentYear === null || this.currentYear === undefined) {
      this.currentYear = moment.utc().year();
    }
    const monthStart = moment.utc().year(this.currentYear).month(this.currentMonth).startOf('month');
    const monthEnd = moment.utc().year(this.currentYear).month(this.currentMonth).endOf('month');

    if (monthStart.isoWeekday() !== 1) {
      monthStart.subtract(monthStart.isoWeekday() - 1, 'days');
    }
    if (monthEnd.isoWeekday() !== 7) {
      monthEnd.add(7 - monthEnd.isoWeekday(), 'days');
    }

    this.dateCells = [];
    let safeCounter = 100;

    while (monthStart.isBefore(monthEnd) && safeCounter > 0) {
      const day = {
        date: monthStart.clone(),
        label: String(monthStart.date()),
        isoweekday: monthStart.isoWeekday(),
        overflow: monthStart.month() !== this.currentMonth,
        today: monthStart.isSame(moment.utc(), 'day'),
        selected: false,
        selectedStart: false,
        selectedEnd: false,
        holiday: false,
        period: false
      };
      const hideDay = this.hideOverflow && day.overflow;
      if (hideDay) {
        day.label = '';
      }

      if (this.holidays && this.holidays.some(holiday => day.date.valueOf() === holiday.valueOf() )) {
        if (!day.overflow || day.overflow && !this.hideOverflow) {
          day.holiday = true;
        }
      }

      this.dateCells.push(day);
      monthStart.add(1, 'days');
      safeCounter--;
    }

    this.weekCells = [
      this.dateCells.slice(0, 7),
      this.dateCells.slice(7, 14),
      this.dateCells.slice(14, 21),
      this.dateCells.slice(21, 28),
      this.dateCells.slice(28, 35),
      this.dateCells.slice(35, 42)
    ];
    this.setSelection();
  }
  setSelection() {
    if (this.selectionStart && this.selectionEnd) {
      this.selectionStartMoment = moment.utc(this.selectionStart).hour(0).minute(0).second(0);
      this.selectionEndMoment = moment.utc(this.selectionEnd).hour(23).minute(59).second(59);
    } else {
      return;
    }

    const period = Math.abs(this.selectionStartMoment.diff(this.selectionEndMoment, 'hours')) > 24;
    for (const i in this.dateCells) {
      if (this.dateCells.hasOwnProperty(i)) {
        this.dateCells[i].selectedStart = false;
        this.dateCells[i].selectedEnd = false;
        const selected = this.dateCells[i].date.isSameOrAfter(this.selectionStartMoment, 'day') &&
          this.dateCells[i].date.isSameOrBefore(this.selectionEndMoment, 'day');
        this.dateCells[i].selected = !period && selected;
        this.dateCells[i].period = period && selected;
        if (this.dateCells[i].date.isSame(this.selectionStartMoment, 'day') && period) {
          this.dateCells[i].selectedStart = true;
        }
        if (this.dateCells[i].date.isSame(this.selectionEndMoment, 'day') && period) {
          this.dateCells[i].selectedEnd = true;
        }
      }
    }
    this.cd.markForCheck();
  }
  onClick($event: any, day: CalendarDay) {
    this.change.next(day.date);
  }
  setState(state: string) {
    this.currentState = state;
    this.cd.markForCheck();
  }
  prevMonth() {
    this.currentMonth = this.currentMonth - 1;
    if (this.currentMonth < 0) {
      this.currentYear = this.currentYear - 1;
      this.currentMonth = 11;
    }
    this.render();
  }
  nextMonth() {
    this.currentMonth = this.currentMonth + 1;
    if (this.currentMonth > 11) {
      this.currentYear = this.currentYear + 1;
      this.currentMonth = 0;
    }
    this.render();
  }
  setMonth(value: number) {
    this.currentMonth = value;
    this.setState('month');
    this.render();
  }
  getMonths() {
    if (!this.months) {
      this.months = moment.months();
    }
    return this.months;
  }
  setYear(value: number) {
    this.currentYear = value;
    this.setState('months');
  }
  getYears() {
    if (!this.years) {
      this.years = [];
      for (let y = this.currentYear - 12; y < this.currentYear + 13; y++) {
        this.years.push(y);
      }
    }

    return this.years;
  }
  getCurrentMonthName() {
    if (this.currentMonth !== undefined) {
      return moment.months(this.currentMonth);
    } else {
      return '';
    }
  }
  updateDisplayPeriod() {
    this.cd.markForCheck();
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['currentYear'] || changes['currentMonth']) {
      this.render();
    }
    if (changes['holidays']) {
      this.render();
    }
    if (changes['currentMonth']) {
      this.updateDisplayPeriod();
    }
    if (changes['selectionStart']) {
      if (this.selectionStart) {
        this.selectionStartMoment = moment.utc(this.selectionStart).hour(0).minute(0).second(0);
      }
    }
    if (changes['selectionEnd']) {
      if (this.selectionEnd) {
        this.selectionEndMoment = moment.utc(this.selectionEnd).hour(23).minute(59).second(59);
      }
    }
    if (changes['selectionStart'] || changes['selectionEnd']) {
      this.setSelection();
    }
    this.cd.markForCheck();
  }
  ngOnInit() {
    this.weekdays = moment.weekdaysMin();
    this.weekdays.push(this.weekdays.shift());
    this.render();
  }
}
