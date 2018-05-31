import moment, { DurationInputArg2 } from 'moment';

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener,
  forwardRef,
  ViewChild,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TextinputComponent } from '../textinput/textinput.component';
import { ShortcutService, ShortcutObservable } from '../shortcut/shortcut.service';
import { DropDownComponent } from '../dropdown/dropdown.component';

const noop = () => {
};

@Component({
  selector: 'oz-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input()
  @HostBinding()
  tabindex = 0;

  @ViewChild('dropdown')
  dropdown: DropDownComponent;

  @ViewChild('input')
  input: TextinputComponent;

  value: string;
  oldValue: string;
  emptyLabel = '----';

  @Input()
  placeholder = '';

  @Input()
  opacity: number;

  @Input()
  max: string;

  @Input()
  disabled = false;

  @Input()
  nopadding: boolean;

  @Input()
  hoursInDay = 8;

  valueMoment: moment.Duration;
  valueMomentOriginal: moment.Duration;

  @HostBinding('class.active')
  editOpened: boolean;
  popupOpened: boolean;

  helpers: any[];

  d1: number;
  d2: number;
  d3: number;
  d4: number;

  valueInputFormat: string;

  focusTimeout = 0;
  shortcut: ShortcutObservable<any>;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @HostListener('focus', ['$event'])
  onFocus(event: any) {
    this.focusTimeout = window.setTimeout(() => {
      this.openEdit(true);
    }, 50);
  }

  constructor(
    private shortcutService: ShortcutService,
    private cd: ChangeDetectorRef,
  ) {
    this.editOpened = false;
    this.helpers = [
      { value: 15, unit: 'm', label: moment.localeData().relativeTime(15, true, 'mm', false) },
      { value: 30, unit: 'm', label: moment.localeData().relativeTime(30, true, 'mm', false) },
      { value: 45, unit: 'm', label: moment.localeData().relativeTime(45, true, 'mm', false) },
      { value: 1, unit: 'h', label: moment.localeData().relativeTime(1, true, 'hh', false) },
      { value: 2, unit: 'h', label: moment.localeData().relativeTime(2, true, 'hh', false) },
      { value: 3, unit: 'h', label: moment.localeData().relativeTime(3, true, 'hh', false) },
      { value: 4, unit: 'h', label: moment.localeData().relativeTime(4, true, 'hh', false) },
      { value: 6, unit: 'h', label: moment.localeData().relativeTime(6, true, 'hh', false) },
      { value: 8, unit: 'h', label: moment.localeData().relativeTime(8, true, 'hh', false) },
      { value: 10, unit: 'h', label: moment.localeData().relativeTime(10, true, 'hh', false) },
      { value: 12, unit: 'h', label: moment.localeData().relativeTime(12, true, 'hh', false) },
      { value: 16, unit: 'h', label: moment.localeData().relativeTime(16, true, 'hh', false) },
      { value: 20, unit: 'h', label: moment.localeData().relativeTime(20, true, 'hh', false) },
      { value: 24, unit: 'h', label: moment.localeData().relativeTime(24, true, 'hh', false) },
      { value: 32, unit: 'h', label: moment.localeData().relativeTime(32, true, 'hh', false) },
      { value: 40, unit: 'h', label: moment.localeData().relativeTime(40, true, 'hh', false) },
    ];
  }
  writeValue(value: any) {
    this.value = value;
    this.parseValue();
    this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.parseValue();
  }
  ngOnDestroy() {
    this.editOpened = false;
    this.dropdown = null;
    this.input = null;
    this.valueMoment = null;
    this.valueMomentOriginal = null;
    this.helpers = null;
    if (this.shortcut) {
      this.shortcut.unsubscribe();
    }
  }
  parseValue() {
    // let valueMoment: moment.Duration;
    if (!this.value) {
      this.valueMoment = moment.duration(0);
      this.valueMomentOriginal = moment.duration(0);
      // valueMoment = moment.duration(0);
    } else {
      this.valueMoment = moment.duration(this.value);
      this.valueMomentOriginal = moment.duration(this.value);
      // valueMoment = moment.duration(this.value);
    }
    this.parseValueMoment();
  }
  parseValueMoment() {
    this.valueInputFormat = '';
    const countHours = Math.floor(this.valueMoment.asHours());
    if (countHours > 0) {
      this.valueInputFormat += ((this.valueInputFormat.length > 0) ? ' ' : '') + countHours + 'h';
    }
    if (this.valueMoment.minutes()) {
      this.valueInputFormat += ((this.valueInputFormat.length > 0) ? ' ' : '') + this.valueMoment.minutes() + 'm';
    }
  }
  setFromHelper(value: any) {
    this.valueMoment = moment.duration(value.value, value.unit);
    this.parseValueMoment();
    this.formatDigits();
    this.disableSelectMode();
    this.updateValue();
  }
  openEdit(value: boolean, omitChanges?: boolean) {
    if (this.disabled) {
      return;
    }
    if (value === this.editOpened) {
      return;
    }
    if (!value) {
      if (!omitChanges) {
        this.editOpened = false;
        this.parseInput();
        this.updateValue();
      } else {
        this.value = this.oldValue;
      }
    } else {
      this.editOpened = true;
      this.oldValue = this.value;
      setTimeout(() => {
        this.input.switchPopup(true);
      });
      this.formatDigits();
    }
    this.cd.markForCheck();
  }
  switchPopup() {

  }
  updateValue() {
    let ret = this.valueMoment.toJSON();
    if (ret[ret.length - 1] === 'H') {
      ret += '0M0S';
    } else if (ret[ret.length - 1] === 'M') {
      ret += '0S';
    }
    this.onChangeCallback(ret);
  }
  getLabel() {
    if (!this.valueMoment) {
      return this.emptyLabel;
    } else if (this.valueMoment.asMinutes() === 0) {
      return this.emptyLabel;
    } else {
      const str: string[] = [];
      if (Math.floor(this.valueMoment.asHours()) > 0) {
        str.push(moment.localeData().relativeTime(Math.floor(this.valueMoment.asHours()), true, 'hh', false));
      }
      if (this.valueMoment.minutes() > 0) {
        str.push(moment.localeData().relativeTime(this.valueMoment.minutes(), true, 'mm', false));
      }
      if (str.length === 0) {
        str.push('0');
      }
      return str.join(' ');
    }
  }
  formatDigits() {
    const min = this.valueMoment.asMinutes();
    const hours = Math.floor(min / 60);
    const minutes = min - 60 * hours;
    this.d1 = Math.floor(hours / 10);
    this.d2 = hours - this.d1 * 10;
    this.d3 = Math.floor(minutes / 10);
    this.d4 = minutes - this.d3 * 10;
  }
  add(value: number, unit: DurationInputArg2, flagParseValueMoment = false) {
    this.valueMoment.add(value, unit);
    if (this.valueMoment.asMilliseconds() < 0) {
      this.valueMoment = moment.duration(0);
    }
    if (flagParseValueMoment) {
      this.parseValueMoment();
    }
    this.formatDigits();
  }
  onKeyDown($event: any) {
    if (($event.key < '0' || $event.key > '9')
      && $event.keyCode !== 87 && $event.keyCode !== 68 && $event.keyCode !== 72 && $event.keyCode !== 77
      && $event.keyCode !== 39 && $event.keyCode !== 37 && $event.keyCode !== 8 && $event.keyCode !== 46
      && $event.keyCode !== 32 && $event.keyCode !== 9) {
      $event.preventDefault();
      return false;
    }
  }
  parseInput() {
    if (this.valueInputFormat.length === 0) {
      return 0;
    }
    this.valueMoment = moment.duration(0);
    let valueInputFormat = this.valueInputFormat;
    let str = '';
    while (valueInputFormat.length > 0) {
      if (valueInputFormat[0].toLowerCase() === 'w') { // weeks
        this.add(parseInt(str, 10) * this.hoursInDay * 5, 'hours');
        str = '';
      } else if (valueInputFormat[0].toLowerCase() === 'd') { // days
        this.add(parseInt(str, 10) * this.hoursInDay, 'hours');
        str = '';
      } else if (valueInputFormat[0].toLowerCase() === 'h') { // hours
        this.add(parseInt(str, 10), 'hours');
        str = '';
      } else if (valueInputFormat[0].toLowerCase() === 'm') { // minutes
        this.add(parseInt(str, 10), 'minutes');
        str = '';
      } else {
        str += valueInputFormat[0];
      }
      valueInputFormat = valueInputFormat.substr(1);
    }
    if (str.length > 0) {
      this.add(parseInt(str, 10), 'hours');
      str = '';
    }
    if (this.max) {
      const maxDuration = moment.duration(this.max);
      if (this.valueMoment.asMilliseconds() > maxDuration.asMilliseconds()) {
        this.valueMoment = maxDuration;
      }
    }
    this.parseValueMoment();
  }
  enableSelectMode(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(this.focusTimeout);
    this.dropdown.show();
    this.shortcut = this.shortcutService.subscribe('Escape', false, false, () => {
      this.disableSelectMode();
    });
  }
  disableSelectMode() {
    this.dropdown.hide();
    if (this.shortcut) {
      this.shortcut.unsubscribe();
    }
  }
  parseTextinput(event: any) {
    this.openEdit(false);
  }
}
