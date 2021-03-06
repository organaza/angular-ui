import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Color } from '../color/color';
import { DropDownComponent } from '../dropdown/dropdown.component';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements ControlValueAccessor {
  @ViewChild('dropdown', { static: true })
  dropdown: DropDownComponent;

  value: string;
  textValue: string;
  color: Color;
  colors: Color[][];
  baseColors: Color[];
  opened: boolean;
  popupPositionTop: string;
  popupPositionLeft: string;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: string) => void = noop;

  @HostListener('keydown')
  onKeyDown(): void {
    this.switchPopup(false);
  }

  constructor(private cd: ChangeDetectorRef) {
    this.opened = false;
    this.color = new Color('#000000');

    this.baseColors = [];
    {
      this.baseColors.push(new Color('#e3635a'));
      this.baseColors.push(new Color('#f6976d'));
      this.baseColors.push(new Color('#faba64'));
      this.baseColors.push(new Color('#d5ce26'));
      this.baseColors.push(new Color('#8cc63e'));
      this.baseColors.push(new Color('#38b449'));
      this.baseColors.push(new Color('#54bfa1'));
      this.baseColors.push(new Color('#47c5e2'));
      this.baseColors.push(new Color('#1997c9'));
      this.baseColors.push(new Color('#0179b5'));
      this.baseColors.push(new Color('#4662a4'));
      this.baseColors.push(new Color('#8463a5'));
      this.baseColors.push(new Color('#da70ac'));
      this.baseColors.push(new Color('#d46481'));
      this.baseColors.push(new Color('#ef4957'));
      this.baseColors.push(new Color('#555d69'));
    }

    this.colors = [];

    const hueConut = 15;
    const hueStep = 1 / hueConut;
    const lightnessCount = 6;
    const lightnessMin = 0.3;
    const lightnessMax = 0.8;
    const lightnessStep = (lightnessMax - lightnessMin) / lightnessCount;
    const saturation = 0.9;

    for (
      let l = lightnessMin;
      l <= lightnessMax - lightnessStep;
      l += lightnessStep
    ) {
      const line: Color[] = [];
      for (let h = 0; h <= 1 - hueStep; h += hueStep) {
        const c = new Color('');
        c.saturation = saturation;
        c.lightness = l;
        c.hue = h;
        c.hslToRgb();
        line.push(c);
      }
      ///
      const cb = new Color('');
      cb.saturation = 0;
      cb.lightness = l;
      cb.hue = 0;
      cb.hslToRgb();
      line.push(cb);
      this.colors.unshift(line);
    }
  }

  writeValue(value: string): void {
    if (value === undefined) {
      value = null;
    }
    this.value = value;
    if (!this.value) {
      this.value = '#000000';
    }
    this.textValue = this.value;
    this.color = new Color(this.value);
    this.cd.markForCheck();
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  selectColor(color: Color): void {
    this.color = color;
    this.switchPopup(false);
  }

  switchPopup(value: boolean): void {
    if (!value) {
      this.opened = value;
      this.dropdown.hide();
      this.value = this.color.getHex();
      this.textValue = this.value;
      this.onChangeCallback(this.value);
    } else {
      this.dropdown.show();
      this.opened = value;
    }
    this.cd.markForCheck();
  }

  parseColor(value: string): void {
    this.color = new Color(value);
    this.value = this.color.getHex();
    this.cd.markForCheck();
  }
}
