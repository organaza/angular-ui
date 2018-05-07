import { Injectable, ComponentFactoryResolver, ComponentRef, Type, ElementRef, HostListener } from '@angular/core';
import { TooltipContainerComponent } from './tooltip-container/tooltip-container.component';
import { TooltipComponent } from './tooltip/tooltip.component';

export class Tooltip {
  componentRef: ComponentRef<{}>;

  constructor(componentRef) {
    this.componentRef = componentRef;
  }
}

@Injectable()
export class TooltipService {
  tooltips: Tooltip[];
  container: TooltipContainerComponent;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.tooltips = [];
  }
  registerContainer(container: TooltipContainerComponent) {
    this.container = container;
  }
  add(text: string = '', width: string = 'auto', maxWidth: string = ''): Tooltip {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TooltipComponent);
    const componentRef: ComponentRef<{}> = this.container.target.createComponent(componentFactory);

    const tooltip = new Tooltip(componentRef);

    this.tooltips.push(tooltip);

    componentRef.instance['text'] = text;
    if (width === 'auto') {
      componentRef.instance['whitespace'] = 'nowrap';
      componentRef.instance['width'] = 'auto';
    } else {
      componentRef.instance['whitespace'] = 'wrap';
      componentRef.instance['width'] = width;
    }
    if (maxWidth) {
      componentRef.instance['maxWidth'] = maxWidth;
      componentRef.instance['whitespace'] = 'wrap';
    }

    return tooltip;
  }
  addWithType(contentType: Type<{}>, data: any): Tooltip {
    const tooltip = this.add();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(contentType);
    const componentRef: ComponentRef<{}> = (<TooltipComponent>tooltip.componentRef.instance).target.createComponent(componentFactory);

    componentRef.instance['data'] = data;

    return tooltip;
  }
  remove(tooltip: Tooltip): any {
    const index = this.tooltips.indexOf(tooltip);
    if (index > -1) {
      this.tooltips.splice(index, 1);
    }
    tooltip.componentRef.destroy();
  }
}
