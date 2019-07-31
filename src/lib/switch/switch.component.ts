import {
  Component,
  Input,
  OnInit,
  ElementRef,
  forwardRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

@Component({
  selector: 'oz-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SwitchComponent implements OnInit, AfterViewInit, ControlValueAccessor {
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

  @ViewChild('idChecked', {static: true}) idChecked: ElementRef;
  @ViewChild('idUnchecked', {static: true}) idUnchecked: ElementRef;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const checkedWidth = this.idChecked.nativeElement.getBoundingClientRect().width;
    const uncheckedWidth = this.idUnchecked.nativeElement.getBoundingClientRect().width;
    this.width = Math.max(checkedWidth, uncheckedWidth);
    this.cd.detectChanges();
  }

  writeValue(value: any) {
    this.value = value;
    this.cd.detectChanges();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
