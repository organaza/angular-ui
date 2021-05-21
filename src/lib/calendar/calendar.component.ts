import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
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
  selectionStart: moment.Moment | string;

  @Input()
  selectionEnd: moment.Moment | string;

  @Input()
  holidays: Array<moment.Moment>;

  @Input()
  hideMonthYearSelection: boolean;

  @Output()
  changed = new EventEmitter<moment.Moment>();

  @Input()
  currentYear: number = moment().year();

  @Input()
  currentMonth: number = moment().month();

  @Input()
  minDate: Date;

  @Input()
  maxDate: Date;

  dateCells: CalendarDay[];
  weekCells: CalendarDay[][];
  weekdays: string[];

  selectionStartMoment: moment.Moment;
  selectionEndMoment: moment.Moment;

  currentState = 'month';

  months: string[];
  years: number[];
  currentEra: string;

  constructor(private cd: ChangeDetectorRef) {}
  render(): void {
    if (this.currentMonth === null || this.currentMonth === undefined) {
      this.currentMonth = moment().month();
    }
    if (this.currentYear === null || this.currentYear === undefined) {
      this.currentYear = moment().year();
    }
    const monthStart = moment()
      .year(this.currentYear)
      .month(this.currentMonth)
      .startOf('month');
    const monthEnd = moment()
      .year(this.currentYear)
      .month(this.currentMonth)
      .endOf('month');

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
        today: monthStart.isSame(moment(), 'day'),
        selected: false,
        selectedStart: false,
        selectedEnd: false,
        holiday: false,
        period: false,
      };
      const hideDay = this.hideOverflow && day.overflow;
      if (hideDay) {
        day.label = '';
      }

      if (
        this.holidays &&
        this.holidays.some((holiday) => {
          return day.date.format('DDMMYYYY') === holiday.format('DDMMYYYY');
        })
      ) {
        if (!day.overflow || (day.overflow && !this.hideOverflow)) {
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
      this.dateCells.slice(35, 42),
    ];
    this.setSelection();
  }
  setSelection(): void {
    if (this.selectionStart && this.selectionEnd) {
      if (moment.isMoment(this.selectionStart)) {
        this.selectionStartMoment = this.selectionStart.clone();
      } else {
        this.selectionStartMoment = moment(this.selectionStart);
      }
      if (moment.isMoment(this.selectionEnd)) {
        this.selectionEndMoment = this.selectionEnd.clone();
      } else {
        this.selectionEndMoment = moment(this.selectionEnd);
      }
    } else {
      return;
    }

    const period =
      Math.abs(this.selectionStartMoment.diff(this.selectionEndMoment, 'm')) >=
      1;
    if (this.dateCells) {
      for (const dateCell of this.dateCells) {
        dateCell.selectedStart = false;
        dateCell.selectedEnd = false;
        const selected =
          dateCell.date.isSameOrAfter(this.selectionStartMoment, 'day') &&
          dateCell.date.isSameOrBefore(this.selectionEndMoment, 'day');
        dateCell.selected = !period && selected;
        dateCell.period = period && selected;
        if (dateCell.date.isSame(this.selectionStartMoment, 'day') && period) {
          dateCell.selectedStart = true;
        }
        if (dateCell.date.isSame(this.selectionEndMoment, 'day') && period) {
          dateCell.selectedEnd = true;
        }
      }
    }
    this.cd.markForCheck();
  }
  onClick(day: CalendarDay): void {
    this.changed.next(day.date);
  }
  setState(state: string): void {
    this.currentState = state;
    this.cd.markForCheck();
  }
  prevMonth(): void {
    this.currentMonth = this.currentMonth - 1;
    if (this.currentMonth < 0) {
      this.currentYear = this.currentYear - 1;
      this.currentMonth = 11;
    }
    this.render();
  }
  nextMonth(): void {
    this.currentMonth = this.currentMonth + 1;
    if (this.currentMonth > 11) {
      this.currentYear = this.currentYear + 1;
      this.currentMonth = 0;
    }
    this.render();
  }
  setMonth(value: number): void {
    this.currentMonth = value;
    this.setState('month');
    this.render();
  }
  getMonths(): Array<string> {
    if (!this.months) {
      this.months = moment.months();
    }
    return this.months;
  }
  setYear(value: number): void {
    this.currentYear = value;
    this.setState('months');
  }
  getYears(): Array<number> {
    if (!this.years) {
      this.years = [];
      for (let y = this.currentYear - 12; y < this.currentYear + 13; y++) {
        this.years.push(y);
      }
    }

    return this.years;
  }
  getCurrentMonthName(): string {
    if (this.currentMonth !== undefined) {
      return moment.months(this.currentMonth);
    } else {
      return '';
    }
  }
  updateDisplayPeriod(): void {
    this.cd.markForCheck();
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
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
        if (moment.isMoment(this.selectionStart)) {
          this.selectionStartMoment = this.selectionStart.clone();
        } else {
          this.selectionStartMoment = moment(this.selectionStart);
        }
      }
    }
    if (changes['selectionEnd']) {
      if (this.selectionEnd) {
        if (moment.isMoment(this.selectionEnd)) {
          this.selectionEndMoment = this.selectionEnd.clone();
        } else {
          this.selectionEndMoment = moment(this.selectionEnd);
        }
      }
    }
    if (changes['selectionStart'] || changes['selectionEnd']) {
      this.setSelection();
    }
    this.cd.markForCheck();
  }
  ngOnInit(): void {
    this.weekdays = moment.weekdaysMin();
    this.weekdays.push(this.weekdays.shift());
    this.render();
  }

  isDateDisabled(date: CalendarDay): boolean {
    if (this.minDate && date.date.toDate() < this.minDate) {
      return true;
    }

    if (this.maxDate && date.date.toDate() > this.maxDate) {
      return true;
    }

    return false;
  }
}
