import { Input, Type, Component, ViewChild, ViewContainerRef, AfterViewInit, HostBinding } from '@angular/core';
import { TooltipService } from '../tooltip.service';

@Component({
  selector: 'oz-tooltip-container',
  templateUrl: './tooltip-container.component.html',
  styleUrls: ['./tooltip-container.component.scss']
})

export class TooltipContainerComponent {
  @ViewChild('container', { read: ViewContainerRef }) target;

  @HostBinding('class.active')
  active: boolean;

  title: string;

  constructor(
    public tooltipService: TooltipService
  ) {
    this.tooltipService.registerContainer(this);
  }
}
