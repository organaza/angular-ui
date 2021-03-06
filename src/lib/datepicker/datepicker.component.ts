import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnInit,
  HostListener,
  forwardRef,
  HostBinding,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import moment from 'moment';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { OzSettingsService } from '../settings/settings.service';
import { DateUtils } from '../dates/dates';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('dropdown', { static: true })
  dropdown: DropDownComponent;

  @Input()
  range: boolean;

  @Input()
  helpers = true;

  @Input()
  outFormat = 'YYYY-MM-DDTHH:mm:ss';

  displayFormat: string;

  @Input()
  emptyLabel: string;

  @Input()
  @HostBinding('class.disabled')
  disabled: boolean;

  @Output()
  changed = new EventEmitter<DatePickerValue>();

  @Input()
  showTime: boolean;

  @Input()
  relative: boolean;

  @Input()
  allowNull: boolean;

  @Input()
  live: boolean;

  @Input()
  confirmRequired: boolean;

  @Input()
  maxDate: Date;

  @Input()
  minDate: Date;

  selectionStart: string;
  selectionStartOld: string;
  selectionStartMoment: moment.Moment;

  selectionEnd: string;
  selectionEndOld: string;
  selectionEndMoment: moment.Moment;

  value: DatePickerValue;

  valueMoment: moment.Moment;

  opened: boolean;

  label: string;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: DatePickerValue) => void = noop;

  @HostBinding()
  tabindex = 0;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.openDateSelector();
    } else if (event.key === 'Escape') {
      this.opened = false;
      this.changed.next(this.value);
      this.onChangeCallback(this.value);
    }
  }

  set labelStart(value: string) {
    this.valueMoment = this.parseValue(value, '');
    this.selectionStartMoment = this.parseValue(value, 'from');

    if (this.relative) {
      this.selectionStart = value;
    } else {
      this.selectionStart = this.selectionStartMoment.format(this.outFormat);
    }

    if (!this.range) {
      this.selectionEnd = value;
      this.selectionEndMoment = this.parseValue(value, 'from');
    }
    if (this.selectionStartMoment.isAfter(this.selectionEndMoment)) {
      this.selectionEndMoment = this.selectionStartMoment.clone().add(1, 'd');
      this.selectionEnd = this.selectionEndMoment.format(this.outFormat);
    }
    this.onChange();
  }

  get labelStart(): string {
    const relative = DateUtils.parseRelative(
      this.selectionStart,
      'from',
    ).isValid();
    if (relative) {
      return this.selectionStart;
    }
    if (this.selectionStartMoment) {
      return this.selectionStartMoment.format(this.displayFormat);
    }
    return this.emptyLabel;
  }

  set labelEnd(value: string) {
    this.selectionEndMoment = this.parseValue(value, 'to');

    if (this.relative) {
      this.selectionEnd = value;
    } else {
      this.selectionEnd = this.selectionEndMoment.format(this.outFormat);
    }
    if (this.selectionEndMoment.isBefore(this.selectionStartMoment)) {
      this.selectionStartMoment = this.selectionEndMoment.clone().add(-1, 'd');
      this.selectionStart = this.selectionEndMoment.format(this.outFormat);
    }
    this.onChange();
  }
  get labelEnd(): string {
    const relative = DateUtils.parseRelative(
      this.selectionStart,
      'to',
    ).isValid();
    if (relative) {
      return this.selectionEnd;
    }
    if (this.selectionEndMoment) {
      return this.selectionEndMoment.format(this.displayFormat);
    }
    return this.emptyLabel;
  }

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private settings: OzSettingsService,
  ) {
    this.outFormat = settings.dateFormat;
    this.opened = false;
  }

  writeValue(value: DatePickerValue): void {
    this.value = value;
    if (Array.isArray(value) && value.length === 2) {
      this.valueMoment = this.parseValue(value[0], '');
      this.selectionStart = this.selectionStartOld = value[0];
      this.selectionEnd = this.selectionEndOld = value[1];
      this.selectionStartMoment = this.parseValue(value[0], 'from');
      this.selectionEndMoment = this.parseValue(value[1], 'to');
    } else {
      this.selectionStart = this.selectionEnd = this.selectionStartOld = this.selectionEndOld = value;
      this.valueMoment = this.selectionStartMoment = this.selectionEndMoment = this.parseValue(
        value,
        '',
      );
    }
    this.setLabel();
    this.cd.detectChanges();
  }

  registerOnChange(fn: (_: DatePickerValue) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    this.emptyLabel = this.emptyLabel || 'Select date';
    this.displayFormat = this.showTime
      ? this.settings.dateTimeShowFormat
      : this.settings.dateShowFormat;
  }
  parseValue(value: string, type: 'from' | 'to' | ''): moment.Moment {
    if (!value) {
      return null;
    } else {
      let result = moment(value, this.outFormat, true);
      if (result.isValid()) {
        return result;
      }
      result = moment(value, this.displayFormat, true);
      if (result.isValid()) {
        return result;
      }
      result = DateUtils.parseRelative(value, type);
      if (result.isValid()) {
        return result;
      }
      return moment();
    }
  }
  openDateSelector(): void {
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
    this.dropdown.show();
  }

  onClearDate(): void {
    this.changed.next(null);
    this.writeValue(null);
    this.onChangeCallback(null);
    this.opened = !this.opened;
    this.dropdown.hide();
    (this.el.nativeElement as HTMLElement).focus();
  }
  setLabel(): void {
    if (!this.range) {
      if (this.valueMoment) {
        this.label = this.valueMoment.format(this.displayFormat);
        this.cd.markForCheck();
        return;
      }
    } else {
      if (this.selectionStartMoment && this.selectionEndMoment) {
        this.label =
          this.selectionStartMoment.format(this.displayFormat) +
          ' - ' +
          this.selectionEndMoment.format(this.displayFormat);
        this.cd.markForCheck();
        return;
      }
    }
    this.label = this.emptyLabel;
    this.cd.markForCheck();
  }
  onCalendarChangeStart(event: moment.Moment): void {
    this.labelStart = event.format(this.outFormat);
    this.onChange();
  }
  onCalendarChangeEnd(event: moment.Moment): void {
    this.labelEnd = event.format(this.outFormat);
    this.onChange();
  }
  onChange(): void {
    if (this.live || !this.confirmRequired) {
      this.updateValue();
    }
    if (!this.live && !this.confirmRequired) {
      this.close();
    }
  }
  onApply(): void {
    this.updateValue();
    this.close();
  }
  updateValue(): void {
    if (this.range) {
      this.writeValue([this.selectionStart, this.selectionEnd]);
    } else {
      this.writeValue(this.selectionStart);
    }
    this.changed.next(this.value);
    this.onChangeCallback(this.value);
    this.setLabel();
  }
  close(): void {
    if (this.range) {
      this.writeValue([this.selectionStartOld, this.selectionEndOld]);
    } else {
      this.writeValue(this.selectionStartOld);
    }
    this.opened = false;
    this.dropdown.hide();
    (this.el.nativeElement as HTMLElement).focus();
  }
  setRelative(from: string, to: string): void {
    this.labelStart = from;
    this.labelEnd = to;
    this.onChange();
  }
}
export type DatePickerValue = string | [string, string];
