import {
  Directive,
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
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import moment from 'moment';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { OzSettingsService } from '../settings/settings.service';

const noop = () => {
};

@Component({
  selector: 'oz-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('dropdown')
  dropdown: DropDownComponent;

  @Input()
  defaultTime: string;

  @Input()
  range: boolean;

  @Input()
  outFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  @Input()
  emptyLabel: string;

  @Input()
  @HostBinding('class.disabled')
  disabled: boolean;

  @Output()
  changed: EventEmitter<{}> = new EventEmitter();

  selectionStart: any;
  selectionStartMoment: any;
  selectionEnd: any;
  selectionEndMoment: any;

  value: any;

  valueMoment: any;

  opened: boolean;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @HostBinding()
  tabindex = 0;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.openDateSelector();
    } else if (event.code === 'Escape') {
      this.opened = false;
      this.changed.next(this.value);
      this.onChangeCallback(this.value);
    }
  }

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    private s: OzSettingsService,
  ) {
    this.outFormat = s.dateFormat;
    this.opened = false;
  }

  writeValue(value: string | string[]) {
    this.value = value;
    if (Array.isArray(value) && value.length === 2) {
      this.valueMoment = this.parseValue(value[0]);
      this.selectionStart = value[0];
      this.selectionEnd = value[1];
      this.selectionStartMoment = this.parseValue(value[0]);
      this.selectionEndMoment = this.parseValue(value[1]);
    } else {
      this.selectionStart = this.selectionEnd = this.value;
      this.valueMoment = this.selectionStartMoment = this.selectionEndMoment = this.parseValue(this.value);
    }
    this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.emptyLabel = this.emptyLabel || 'Select date';
  }
  parseValue(value) {
    if (!value) {
      return null;
    } else {
      return moment(value, this.outFormat).utc();
    }
  }
  openDateSelector() {
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
    this.dropdown.show();
  }

  clearDate() {
    this.changed.next(null);
    this.writeValue(null);
    this.onChangeCallback(null);
    this.opened = !this.opened;
    this.dropdown.hide();
    this.el.nativeElement.focus();
  }
  getLabel() {
    if (!this.range) {
      if (this.valueMoment) {
        return this.valueMoment.format('L');
      }
    } else {
      if (this.selectionStartMoment && this.selectionEndMoment) {
        return this.selectionStartMoment.format('L') + ' - ' + this.selectionEndMoment.format('L');
      }
    }
    return this.emptyLabel;
  }
  onCalendarChange(event: any) {
    if (this.range) {
      return;
    }
    this.writeValue(event.format(this.outFormat));

    this.changed.next(this.value);
    this.onChangeCallback(this.value);

    this.opened = false;
    this.dropdown.hide();
    this.el.nativeElement.focus();
  }
  onCalendarChangeStart(event: moment.Moment) {
    if (!this.range) {
      return;
    }
    this.selectionStart = event.format(this.outFormat);
    this.writeValue([this.selectionStart, this.selectionEnd]);
  }
  onCalendarChangeEnd(event: moment.Moment) {
    if (!this.range) {
      return;
    }
    this.selectionEnd = event.format(this.outFormat);
    this.writeValue([this.selectionStart, this.selectionEnd]);
  }
  onClose() {
    this.changed.next(this.value);
    this.onChangeCallback(this.value);

    this.opened = false;
    this.dropdown.hide();
    this.el.nativeElement.focus();
  }
  setRange(amount: number, unit: moment.DurationInputArg2) {
    this.selectionStart = moment().utc().subtract(amount, unit).format(this.outFormat);
    this.selectionEnd = moment().utc().format(this.outFormat);
    this.writeValue([this.selectionStart, this.selectionEnd]);
  }
}
