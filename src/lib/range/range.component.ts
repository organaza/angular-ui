import {
  Component,
  Output,
  Input,
  ElementRef,
  EventEmitter,
  OnInit,
  forwardRef,
  Renderer2,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { JSONUtils } from '../json/json';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const noop = () => {
};

@Component({
  selector: 'oz-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeComponent implements OnInit, ControlValueAccessor {
  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: any) => void = noop;

  @Output()
  change: EventEmitter<{}> = new EventEmitter();
  @Output()
  enter: EventEmitter<{}> = new EventEmitter();
  @Output()
  changeEnd: EventEmitter<{}> = new EventEmitter();

  onModelChanged: Subject<any> = new Subject<any>();

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
  moveGlobal: any;
  upGlobal: any;
  newValue: number;
  deltaX: number;
  sliderLeft: number;
  sliderOpacity: number;

  widthSliderProcent: number;
  widthParentElement: number;

  @ViewChild('elementSlider') elementSlider: ElementRef;

  writeValue(value: any) {
    if (value === undefined || value === null) {
      value = 0;
    }
    this.value = JSONUtils.jsonClone(value);
    this.value = this.testAndChangeValue(this.value);
    this.calcParams();
    this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.onModelChanged.pipe(
      debounceTime(this.liveDebounce), // wait 300ms after the last event before emitting last event
      distinctUntilChanged(), // only emit if value is different from previous value
    ).subscribe((value: any) => {
        this.change.next(value);
        this.onChangeCallback(value);
        this.changeEnd.next(value);
      });
  }
  testAndUpdateValue() {
    setTimeout(() => {
      this.value = this.testAndChangeValue(this.value);
      this.change.next(this.value);
      this.onChangeCallback(this.value);
      this.changeEnd.next();
    });
  }
  onKeyDown($event: any) {
    if (($event.key < '0' || $event.key > '9')
      && $event.keyCode !== 39 && $event.keyCode !== 37 && $event.keyCode !== 8 && $event.keyCode !== 46) {
      $event.preventDefault();
      return false;
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
  changeSliderPosition(value: number) {
    this.value = value;
    if (this.live) {
      if (this.liveDebounce > 0) {
        this.onModelChanged.next(this.value);
      } else {
        this.onChangeCallback(this.value);
        this.change.next(this.value);
      }
    }
  }
  koef(): number {
    return 100 / (this.max - this.min);
  }
  onClickProgress(event: MouseEvent) {
    if (this.dragSlider || this.disabled) {
      return;
    }
    const percent: number = event.offsetX * 100 / this.el.nativeElement.getBoundingClientRect().width / this.koef();
    this.value = this.testAndChangeValue(this.min + Math.round(percent / this.step) * this.step);
    this.sliderLeft = this.calcPercent();
    this.cd.markForCheck();
    this.change.next(this.value);
    this.onChangeCallback(this.value);
    this.changeEnd.next(this.value);
  }
  saveChange() {
    this.change.next(this.value);
    this.onChangeCallback(this.value);
    this.changeEnd.next(this.value);
    setTimeout(() => {
      this.dragSlider = false;
    });
  }
  onMouseDown(event: MouseEvent) {
    if (this.disabled) {
      return;
    }
    if (event.button === 3) { // disable right click drag
      return false;
    }
    if (this.filled) {
      this.sliderOpacity = 1;
    }
    this.dragSlider = true;
    this.prevScreenX = event.screenX;
    this.calcParams();
    this.newValue = this.value;
    this.deltaX = 0;
    this.moveGlobal = this.renderer.listen('window', 'mousemove', (moveEvent: MouseEvent) => {
      this.deltaX += -(this.prevScreenX - moveEvent.screenX);
      this.prevScreenX = moveEvent.screenX;
      const percent: number = this.deltaX * 100 / this.widthParentElement / this.koef();
      if (percent >= this.step || percent <= -this.step) {
        const step = parseInt((percent / this.step) + ' ', 10) * this.step;
        this.newValue += step;
        this.deltaX = (percent - step) * this.widthParentElement / 100 * this.koef();
        this.value = this.testMinMaxValue(this.newValue);
        this.sliderLeft = this.calcPercent();
        this.cd.markForCheck();
        this.changeSliderPosition(Math.round(this.value));
      }
    });
    this.upGlobal = this.renderer.listen('window', 'mouseup', () => {
      if (this.filled) {
        this.sliderOpacity = 1;
      }
      this.saveChange();
      this.moveGlobal();
      this.upGlobal();
    });
    event.preventDefault();
    return false;
  }
  calcParams() {
    if (!this.elementSlider) {
      return;
    }
    this.widthParentElement = this.el.nativeElement.getBoundingClientRect().width;
    this.widthSliderProcent = this.elementSlider.nativeElement.getBoundingClientRect().width * 100 / this.widthParentElement;
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
