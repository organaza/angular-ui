import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeComponent implements OnInit, ControlValueAccessor {
  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: number) => void = noop;

  @Output()
  changed = new EventEmitter<number>();
  @Output()
  enter = new EventEmitter<void>();
  @Output()
  changeEnd = new EventEmitter<void>();

  onModelChanged: Subject<number> = new Subject<number>();

  @Input()
  disabled = false;

  @Input()
  min = 0;

  @Input()
  max = 100;

  @Input()
  step = 1;

  @Input()
  filled: boolean;

  @Input()
  live: boolean;

  @Input()
  liveDebounce = 0;

  value: number;
  dragSlider: boolean;

  drag = false;
  prevScreenX = 0;
  moveGlobal: () => void;
  upGlobal: () => void;
  newValue: number;
  deltaX: number;
  sliderLeft: number;
  sliderOpacity: number;

  widthSliderProcent: number;
  widthParentElement: number;

  @ViewChild('elementSlider', { static: true }) elementSlider: ElementRef;

  writeValue(value: number): void {
    if (value === undefined || value === null) {
      value = 0;
    }
    this.value = this.testAndChangeValue(this.value);
    this.calcParams();
    this.cd.detectChanges();
  }

  registerOnChange(fn: (_: number) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.onModelChanged
      .pipe(
        debounceTime(this.liveDebounce), // wait 300ms after the last event before emitting last event
        distinctUntilChanged(), // only emit if value is different from previous value
      )
      .subscribe((value: number) => {
        this.changed.next(value);
        this.onChangeCallback(value);
      });
  }
  testAndUpdateValue(): void {
    window.setTimeout(() => {
      this.value = this.testAndChangeValue(this.value);
      this.changed.next(this.value);
      this.onChangeCallback(this.value);
      this.changeEnd.next();
    });
  }
  onKeyDown(event: KeyboardEvent): void {
    if (
      (event.key < '0' || event.key > '9') &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete'
    ) {
      event.preventDefault();
      return;
    }
  }
  testAndChangeValue(value: number): number {
    if (value > this.max) {
      value = this.max;
    }
    if (value < this.min) {
      value = this.min;
    }
    return value;
  }
  changeSliderPosition(value: number): void {
    this.value = value;
    if (this.live) {
      if (this.liveDebounce > 0) {
        this.onModelChanged.next(this.value);
      } else {
        this.onChangeCallback(this.value);
        this.changed.next(this.value);
      }
    }
  }
  koef(): number {
    return 100 / (this.max - this.min);
  }
  onClickProgress(event: MouseEvent): void {
    if (this.dragSlider || this.disabled) {
      return;
    }
    const percent: number =
      (event.offsetX * 100) /
      (this.el.nativeElement as HTMLElement).getBoundingClientRect().width /
      this.koef();
    this.value = this.testAndChangeValue(
      this.min + Math.round(percent / this.step) * this.step,
    );
    this.sliderLeft = this.calcPercent();
    this.cd.markForCheck();
    this.changed.next(this.value);
    this.onChangeCallback(this.value);
  }
  saveChange(): void {
    this.changed.next(this.value);
    this.onChangeCallback(this.value);
    window.setTimeout(() => {
      this.dragSlider = false;
    });
  }
  onMouseDown(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    if (event.button === 3) {
      // disable right click drag
      return;
    }
    if (this.filled) {
      this.sliderOpacity = 1;
    }
    this.dragSlider = true;
    this.prevScreenX = event.screenX;
    this.calcParams();
    this.newValue = this.value;
    this.deltaX = 0;
    this.moveGlobal = this.renderer.listen(
      'window',
      'mousemove',
      (moveEvent: MouseEvent) => {
        this.deltaX += -(this.prevScreenX - moveEvent.screenX);
        this.prevScreenX = moveEvent.screenX;
        const percent: number =
          (this.deltaX * 100) / this.widthParentElement / this.koef();
        if (percent >= this.step || percent <= -this.step) {
          const step = Math.round(percent / this.step);
          this.newValue += step;
          this.deltaX =
            (((percent - step) * this.widthParentElement) / 100) * this.koef();
          this.value = this.testMinMaxValue(this.newValue);
          this.sliderLeft = this.calcPercent();
          this.cd.markForCheck();
          this.changeSliderPosition(Math.round(this.value));
        }
      },
    );
    this.upGlobal = this.renderer.listen('window', 'mouseup', () => {
      if (this.filled) {
        this.sliderOpacity = 1;
      }
      this.saveChange();
      this.moveGlobal();
      this.upGlobal();
    });
    event.preventDefault();
    return;
  }
  calcParams(): void {
    if (!this.elementSlider) {
      return;
    }
    this.widthParentElement = (this.el
      .nativeElement as HTMLElement).getBoundingClientRect().width;
    this.widthSliderProcent =
      ((this.elementSlider.nativeElement as HTMLElement).getBoundingClientRect()
        .width *
        100) /
      this.widthParentElement;
    this.sliderLeft = this.calcPercent();
    this.cd.markForCheck();
  }
  testMinMaxValue(value: number): number {
    if (value > this.max) {
      value = this.max;
    }
    if (value < this.min) {
      value = this.min;
    }
    return value;
  }
  calcPercent(): number {
    return (this.testMinMaxValue(this.value) - this.min) * this.koef();
  }
}
