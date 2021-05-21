import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { Placement } from '@popperjs/core';

@Component({
  selector: 'oz-text-with-tooltip',
  templateUrl: './text-with-tooltip.component.html',
  styleUrls: ['./text-with-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextWithTooltipComponent {
  @Input()
  label: string;

  @Input()
  tooltipWidth: string;

  @Input()
  tooltipDirection: Placement = 'auto';

  @Input()
  textAlign: string;

  displayTooltip: boolean;

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;

  @HostListener('mouseenter') onMouseEnter(): void {
    this.displayTooltip = !(
      (this.wrapper.nativeElement as HTMLElement).scrollWidth >
      (this.wrapper.nativeElement as HTMLElement).offsetWidth
    );
    this.cd.detectChanges();
  }

  constructor(private cd: ChangeDetectorRef) {}
}
