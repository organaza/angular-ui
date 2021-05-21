import moment, {
  DurationInputArg1,
  DurationInputArg2,
  unitOfTime,
} from 'moment';

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
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { TextinputComponent } from '../textinput/textinput.component';
import {
  ShortcutService,
  ShortcutObservable,
} from '../shortcut/shortcut.service';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { OzSettingsService } from '../settings/settings.service';

const noop = () => {
  return;
};

interface TimePickerHint {
  value: number;
  unit: DurationInputArg2;
  label: string;
}
@Component({
  selector: 'oz-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input()
  @HostBinding()
  tabindex = 0;

  @ViewChild('dropdown', { static: true })
  dropdown: DropDownComponent;

  @ViewChild('input')
  input: TextinputComponent;

  value: DurationInputArg1;
  oldValue: DurationInputArg1;
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
  icon: string;

  @Input()
  nopadding: boolean;

  @Input()
  hoursInDay = 8;

  @Input()
  defaultInputUnit: unitOfTime.DurationConstructor = 'hours';

  @Input()
  showClear = false;

  valueMoment: moment.Duration;
  valueMomentOriginal: moment.Duration;
  @HostBinding('class.focus')
  editOpened: boolean;
  popupOpened: boolean;

  helpers: TimePickerHint[];

  d1: number;
  d2: number;
  d3: number;
  d4: number;

  valueInput: string;

  focusTimeout = -1;
  shortcut: ShortcutObservable;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: DurationInputArg1) => void = noop;

  @HostListener('focusin', ['$event'])
  onFocus(): void {
    this.focusTimeout = window.setTimeout(() => {
      this.openEdit(true);
    }, 50);
  }

  constructor(
    private shortcutService: ShortcutService,
    private settingService: OzSettingsService,
    private cd: ChangeDetectorRef,
  ) {
    this.editOpened = false;
    this.helpers = [
      {
        value: 15,
        unit: 'm',
        label: moment.localeData().relativeTime(15, true, 'mm', false),
      },
      {
        value: 30,
        unit: 'm',
        label: moment.localeData().relativeTime(30, true, 'mm', false),
      },
      {
        value: 45,
        unit: 'm',
        label: moment.localeData().relativeTime(45, true, 'mm', false),
      },
      {
        value: 1,
        unit: 'h',
        label: moment.localeData().relativeTime(1, true, 'hh', false),
      },
      {
        value: 2,
        unit: 'h',
        label: moment.localeData().relativeTime(2, true, 'hh', false),
      },
      {
        value: 3,
        unit: 'h',
        label: moment.localeData().relativeTime(3, true, 'hh', false),
      },
      {
        value: 4,
        unit: 'h',
        label: moment.localeData().relativeTime(4, true, 'hh', false),
      },
      {
        value: 6,
        unit: 'h',
        label: moment.localeData().relativeTime(6, true, 'hh', false),
      },
      {
        value: 8,
        unit: 'h',
        label: moment.localeData().relativeTime(8, true, 'hh', false),
      },
      {
        value: 10,
        unit: 'h',
        label: moment.localeData().relativeTime(10, true, 'hh', false),
      },
      {
        value: 12,
        unit: 'h',
        label: moment.localeData().relativeTime(12, true, 'hh', false),
      },
      {
        value: 16,
        unit: 'h',
        label: moment.localeData().relativeTime(16, true, 'hh', false),
      },
      {
        value: 20,
        unit: 'h',
        label: moment.localeData().relativeTime(20, true, 'hh', false),
      },
      {
        value: 24,
        unit: 'h',
        label: moment.localeData().relativeTime(24, true, 'hh', false),
      },
      {
        value: 32,
        unit: 'h',
        label: moment.localeData().relativeTime(32, true, 'hh', false),
      },
      {
        value: 40,
        unit: 'h',
        label: moment.localeData().relativeTime(40, true, 'hh', false),
      },
    ];
    this.icon = this.settingService.timepickerHelperIcon;
  }
  writeValue(value: DurationInputArg1): void {
    this.value = value;
    this.parseValue();
    this.cd.detectChanges();
    this.updateValue();
  }

  registerOnChange(fn: (_: DurationInputArg1) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    this.parseValue();
  }
  ngOnDestroy(): void {
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
  parseValue(): void {
    if (!this.value) {
      this.valueMoment = moment.duration(0);
      this.valueMomentOriginal = moment.duration(0);
    } else {
      this.valueMoment = moment.duration(this.value);
      this.valueMomentOriginal = moment.duration(this.value);
    }
    this.parseValueMoment();
  }
  parseValueMoment(): void {
    this.valueInput = '';
    const countHours = Math.floor(this.valueMoment.asHours());
    if (countHours > 0) {
      this.valueInput += `${
        this.valueInput.length > 0 ? ' ' : ''
      }${countHours}h`;
    }
    if (this.valueMoment.minutes()) {
      this.valueInput += `${
        this.valueInput.length > 0 ? ' ' : ''
      }${this.valueMoment.minutes()}m`;
    }
    if (this.valueMoment.seconds()) {
      this.valueInput += `${
        this.valueInput.length > 0 ? ' ' : ''
      }${this.valueMoment.seconds()}s`;
    }
  }
  setFromHelper(value: TimePickerHint): void {
    this.valueMoment = moment.duration(value.value, value.unit);
    this.parseValueMoment();
    this.disableSelectMode();
    this.updateValue();
  }
  openEdit(value: boolean, omitChanges?: boolean): void {
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
      window.setTimeout(() => {
        this.input.switchPopup(true);
      });
    }
    this.cd.markForCheck();
  }
  switchPopup(): void {
    return;
  }
  updateValue(): void {
    let ret = this.valueMoment.toJSON();
    if (ret[ret.length - 1] === 'H') {
      ret += '0M0S';
    } else if (ret[ret.length - 1] === 'M') {
      ret += '0S';
    }
    this.onChangeCallback(ret);
  }
  getLabel(): string {
    if (!this.valueMoment) {
      return this.emptyLabel;
    } else if (this.valueMoment.asMinutes() === 0) {
      return this.emptyLabel;
    } else {
      const str: string[] = [];
      if (Math.floor(this.valueMoment.asHours()) > 0) {
        str.push(
          moment
            .localeData()
            .relativeTime(
              Math.floor(this.valueMoment.asHours()),
              true,
              'hh',
              false,
            ),
        );
      }
      if (this.valueMoment.minutes() > 0) {
        str.push(
          moment
            .localeData()
            .relativeTime(this.valueMoment.minutes(), true, 'mm', false),
        );
      }
      if (this.valueMoment.seconds() > 0) {
        str.push(
          moment
            .localeData()
            .relativeTime(this.valueMoment.seconds(), true, 'ss', false),
        );
      }
      if (str.length === 0) {
        str.push('0');
      }
      return str.join(' ');
    }
  }
  add(
    value: number,
    unit: unitOfTime.DurationConstructor,
    flagParseValueMoment = false,
  ): void {
    this.valueMoment.add(value, unit);
    if (this.valueMoment.asMilliseconds() < 0) {
      this.valueMoment = moment.duration(0);
    }
    if (flagParseValueMoment) {
      this.parseValueMoment();
    }
  }
  onKeyDown(event: KeyboardEvent): void {
    if (
      (event.key < '0' || event.key > '9') &&
      event.code !== 'KeyW' &&
      event.code !== 'KeyD' &&
      event.code !== 'KeyH' &&
      event.code !== 'KeyM' &&
      event.code !== 'KeyS' &&
      event.code !== 'ArrowRight' &&
      event.code !== 'ArrowLeft' &&
      event.code !== 'Backspace' &&
      event.code !== 'Delete' &&
      event.code !== 'Space' &&
      event.code !== 'Tab'
    ) {
      event.preventDefault();
    }
  }
  parseInput(): void {
    this.valueMoment = moment.duration(0);
    if (this.valueInput.length === 0) {
      return;
    }
    let valueInput = this.valueInput;
    let str = '';
    while (valueInput.length > 0) {
      if (valueInput[0].toLowerCase() === 'w') {
        // weeks
        this.add(parseInt(str, 10) * this.hoursInDay * 5, 'hours');
        str = '';
      } else if (valueInput[0].toLowerCase() === 'd') {
        // days
        this.add(parseInt(str, 10) * this.hoursInDay, 'hours');
        str = '';
      } else if (valueInput[0].toLowerCase() === 'h') {
        // hours
        this.add(parseInt(str, 10), 'hours');
        str = '';
      } else if (valueInput[0].toLowerCase() === 'm') {
        // minutes
        this.add(parseInt(str, 10), 'minutes');
        str = '';
      } else if (valueInput[0].toLowerCase() === 's') {
        // minutes
        this.add(parseInt(str, 10), 'seconds');
        str = '';
      } else {
        str += valueInput[0];
      }
      valueInput = valueInput.substr(1);
    }
    if (str.length > 0) {
      this.add(parseInt(str, 10), this.defaultInputUnit);
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
  enableSelectMode(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.focusTimeout);
    this.dropdown.show();
    this.shortcut = this.shortcutService.subscribe(
      'Escape',
      false,
      false,
      () => {
        this.disableSelectMode();
      },
    );
  }
  disableSelectMode(): void {
    this.dropdown.hide();
    if (this.shortcut) {
      this.shortcut.unsubscribe();
    }
  }
  parseTextinput(): void {
    this.openEdit(false);
  }
  onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.writeValue('0');
    this.updateValue();
  }
}
