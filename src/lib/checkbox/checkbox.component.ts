import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Strings } from '../string/string';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input()
  @HostBinding()
  tabindex = 0;

  value: boolean;

  @Input()
  label: string;

  @Input()
  disabled: boolean;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: boolean) => void = noop;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onClickCheckbox(event);
    }
  }

  constructor(private cd: ChangeDetectorRef) {}

  writeValue(value: string | number | boolean): void {
    this.value = Strings.parseBoolean(value);
    this.cd.detectChanges();
  }

  registerOnChange(fn: (_: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  onClickCheckbox(event: MouseEvent | KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    event.stopPropagation();
    this.value = !this.value;
    this.onChangeCallback(this.value);
  }
}
