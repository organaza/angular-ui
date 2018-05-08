import {
  Input,
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  HostListener,
  ChangeDetectorRef
 } from '@angular/core';

@Component({
  selector: 'oz-text-with-tooltip',
  templateUrl: './text-with-tooltip.component.html',
  styleUrls: ['./text-with-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TextWithTooltipComponent implements OnInit {
  @Input()
  label: string;

  @Input()
  tooltipWidth: string;

  @Input()
  tooltipDirection = 'top';

  @Input()
  textAlign: string;

  displayTooltip: boolean;

  @ViewChild('wrapper') wrapper: ElementRef;

  @HostListener('mouseenter') onMouseEnter() {
    this.displayTooltip = !(this.wrapper.nativeElement.scrollWidth > this.wrapper.nativeElement.offsetWidth);
    this.cd.detectChanges();
  }

  constructor(
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }
}
