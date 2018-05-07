import {
  Directive,
  Component,
  Input,
  Output,
  ElementRef,
  HostBinding,
  EventEmitter,
  OnInit,
  HostListener,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

@Component({
  selector: 'oz-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CheckboxComponent implements OnInit, ControlValueAccessor {
  @Input()
  @HostBinding()
  tabindex = 0;

  value: boolean;

  @Input()
  label: string;

  @Input()
  disabled: boolean;

  @Output()
  change: EventEmitter<{}> = new EventEmitter();

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'Space') {
      this.onClickCheckbox(event);
    }
  }

  constructor(
    private el: ElementRef,
    private cd: ChangeDetectorRef,
  ) { }

  writeValue(value: any) {
    if (value === undefined) {
      this.value = false;
      this.onChangeCallback(this.value);
    }
    this.value = value;
    this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {

  }

  onClickCheckbox(event: MouseEvent | KeyboardEvent) {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.value = !this.value;
    this.onChangeCallback(this.value);
    this.change.next();
  }
}
