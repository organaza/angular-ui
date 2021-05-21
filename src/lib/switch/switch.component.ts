import {
  Component,
  Input,
  ElementRef,
  forwardRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
  return;
};

@Component({
  selector: 'oz-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent implements AfterViewInit, ControlValueAccessor {
  @Input()
  labelChecked = 'Good';

  @Input()
  labelUnchecked = 'Bad';

  value: boolean;
  width: number;

  set valueInside(value: boolean) {
    this.value = value;
    this.onChangeCallback(this.value);
  }
  get valueInside(): boolean {
    return this.value;
  }

  @ViewChild('idChecked', { static: true }) idChecked: ElementRef;
  @ViewChild('idUnchecked', { static: true }) idUnchecked: ElementRef;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: boolean) => void = noop;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const checkedWidth = (this.idChecked
      .nativeElement as HTMLElement).getBoundingClientRect().width;
    const uncheckedWidth = (this.idUnchecked
      .nativeElement as HTMLElement).getBoundingClientRect().width;
    this.width = Math.max(checkedWidth, uncheckedWidth);
    this.cd.detectChanges();
  }

  writeValue(value: boolean): void {
    this.value = value;
    this.cd.detectChanges();
  }

  registerOnChange(fn: (_: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }
}
