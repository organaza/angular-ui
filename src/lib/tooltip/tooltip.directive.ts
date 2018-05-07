import { OnDestroy, Directive, Input, ElementRef, HostListener, Type} from '@angular/core';
import { TooltipService, Tooltip } from './tooltip.service';
import { TooltipComponent } from '../tooltip/tooltip/tooltip.component';

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
      window.setTimeout(() => {
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
        window.clearTimeout(this.showTimeout);
        this.tooltipService.remove(this.tooltip);
      }
    }
  }
  get tooltipDisabled(): boolean {
    return this._tooltipDisabled;
  }
  _tooltipDisabled = false;

  @Input()
  tooltipDirection = 'top';

  @Input()
  tooltipType: Type<{}>;

  @Input()
  tooltipHideBack = false;

  @Input()
  tooltipData: any;

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
  tooltipPadding = 7;

  @Input()
  tooltipDataField = 'data';


  constructor(
    private tooltipService: TooltipService,
    private el: ElementRef
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipType && (!this.ozTooltip || !this.ozTooltip.trim())) {
      return;
    }
    window.clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
    this.showTimeout = window.setTimeout(() => {
      if (this.tooltipDisabled) {
        return;
      }
      if (!this.tooltipType) {
        this.tooltip = this.tooltipService.add(this.ozTooltip, this.tooltipWidth, this.tooltipMaxWidth);
      } else {
        this.tooltip = this.tooltipService.addWithType(
          this.tooltipType,
          this.tooltipData,
          this.tooltipDataField,
          this.tooltipWidth,
          this.tooltipMaxWidth,
          this.tooltipHideBack
        );
      }
      window.setTimeout(() => {
        this.place();
      });
    }, this.tooltipTimeout);
  }

  @HostListener('mouseleave') onMouseLeave() {
    window.clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }
  @HostListener('mousedown') onMouseDown() {
    window.clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }

  ngOnDestroy() {
    window.clearTimeout(this.showTimeout);
    if (this.tooltip) {
      this.tooltipService.remove(this.tooltip);
    }
  }

  place() {
    const anchorBounds: ClientRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipBounds: ClientRect = this.tooltip.componentRef.location.nativeElement.getBoundingClientRect();

    const anchorCenterX = anchorBounds.left + anchorBounds.width / 2;
    const anchorCenterY = anchorBounds.top + anchorBounds.height / 2;

    switch (this.tooltipDirection) {
      case 'top':
        this.tooltip.componentRef.instance['x'] = anchorCenterX - tooltipBounds.width / 2;
        this.tooltip.componentRef.instance['y'] = anchorBounds.top - tooltipBounds.height - this.tooltipPadding;
      break;
      case 'bottom':
        this.tooltip.componentRef.instance['x'] = anchorCenterX - tooltipBounds.width / 2;
        this.tooltip.componentRef.instance['y'] = anchorBounds.bottom + this.tooltipPadding;
      break;
      case 'left':
        this.tooltip.componentRef.instance['x'] = anchorBounds.left - tooltipBounds.width - this.tooltipPadding;
        this.tooltip.componentRef.instance['y'] = anchorCenterY - tooltipBounds.height / 2;
        this.tooltip.componentRef.instance['textAlign'] = 'right';
      break;
      case 'right':
        this.tooltip.componentRef.instance['x'] = anchorBounds.right + this.tooltipPadding;
        this.tooltip.componentRef.instance['y'] = anchorCenterY - tooltipBounds.height / 2;
        this.tooltip.componentRef.instance['textAlign'] = 'left';
      break;
    }
    if (this.textAlign) {
      this.tooltip.componentRef.instance['textAlign'] = this.textAlign;
    }
    if ((this.tooltipDirection === 'top' || this.tooltipDirection === 'bottom') && this.tooltip.componentRef.instance['x'] < 0) {
      this.tooltip.componentRef.instance['x'] = 5;
    }
  }
}
