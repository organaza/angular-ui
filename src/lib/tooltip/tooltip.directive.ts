import {
  OnDestroy,
  Directive,
  Input,
  ElementRef,
  HostListener,
  Type,
} from '@angular/core';
import { TooltipService, Tooltip } from './tooltip.service';
import { createPopper, Placement } from '@popperjs/core';

@Directive({
  selector: '[ozTooltip]',
})
export class TooltipDirective implements OnDestroy {
  showTimeout = -1;

  @Input()
  set ozTooltip(value: string) {
    this._ozTooltip = value;
    if (this.tooltip) {
      this.tooltip.componentRef.instance['text'] = value;
      setTimeout(() => {
        this.place();
      });
    }
  }

  get ozTooltip(): string {
    return this._ozTooltip;
  }
  _ozTooltip: string;

  @Input()
  set tooltipDisabled(value: boolean) {
    this._tooltipDisabled = value;
    if (value) {
      if (this.tooltip) {
        clearTimeout(this.showTimeout);
        this.tooltipService.remove(this.tooltip);
      }
    }
  }
  get tooltipDisabled(): boolean {
    return this._tooltipDisabled;
  }
  _tooltipDisabled = false;

  @Input()
  tooltipDirection: Placement = 'top';

  @Input()
  tooltipType: Type<unknown>;

  @Input()
  tooltipHideBack = false;

  @Input()
  tooltipData: unknown;

  @Input()
  tooltipTimeout = 500;

  @Input()
  tooltipWidth: string;

  @Input()
  tooltipMaxWidth: string;

  @Input()
  textAlign: string;

  tooltip: Tooltip;

  @Input()
  tooltipOffset: [number, number] = [0, 0];

  @Input()
  tooltipDataField = 'data';

  constructor(private tooltipService: TooltipService, private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    if (!this.tooltipType && (!this.ozTooltip || !this.ozTooltip.trim())) {
      return;
    }
    clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
    this.showTimeout = window.setTimeout(() => {
      if (this.tooltipDisabled) {
        return;
      }
      if (!this.tooltipType) {
        this.tooltip = this.tooltipService.add(
          this.ozTooltip,
          this.tooltipWidth,
          this.tooltipMaxWidth,
        );
      } else {
        this.tooltip = this.tooltipService.addWithType(
          this.tooltipType,
          this.tooltipData,
          this.tooltipDataField,
          this.tooltipWidth,
          this.tooltipMaxWidth,
          this.tooltipHideBack,
        );
      }
      this.tooltip.componentRef.changeDetectorRef.detectChanges();
      this.place();
    }, this.tooltipTimeout);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }
  @HostListener('mousedown') onMouseDown(): void {
    clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }

  place(): void {
    createPopper(
      this.el.nativeElement as HTMLElement,
      this.tooltip.componentRef.location.nativeElement as HTMLElement,
      {
        placement: this.tooltipDirection,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: this.tooltipOffset,
            },
          },
          {
            name: 'computeStyles',
            options: {
              gpuAcceleration: false, // true by default
            },
          },
        ],
      },
    );
  }
}
