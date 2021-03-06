import {
  Injectable,
  ComponentFactoryResolver,
  ComponentRef,
  Type,
} from '@angular/core';
import { TooltipContainerComponent } from './tooltip-container/tooltip-container.component';
import { TooltipComponent } from './tooltip/tooltip.component';

export class Tooltip {
  componentRef: ComponentRef<TooltipComponent>;

  constructor(componentRef: ComponentRef<TooltipComponent>) {
    this.componentRef = componentRef;
  }
}

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  tooltips: Tooltip[];
  container: TooltipContainerComponent;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.tooltips = [];
  }
  registerContainer(container: TooltipContainerComponent): void {
    this.container = container;
  }
  add(
    text: string = '',
    width: string = 'auto',
    maxWidth: string = '',
    hideBack: boolean = false,
  ): Tooltip {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory<TooltipComponent>(
      TooltipComponent,
    );
    const componentRef = this.container.target.createComponent(
      componentFactory,
    );

    const tooltip = new Tooltip(componentRef);

    this.tooltips.push(tooltip);

    componentRef.instance['text'] = text;
    componentRef.instance['hideBack'] = hideBack;
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
  addWithType(
    contentType: Type<unknown>,
    data: unknown,
    dataField: string,
    width: string = 'auto',
    maxWidth: string = '',
    hideBack: boolean,
  ): Tooltip {
    const tooltip = this.add('', width, maxWidth, hideBack);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      contentType,
    );
    const componentRef = tooltip.componentRef.instance.target.createComponent(
      componentFactory,
    );

    componentRef.instance[dataField] = data;

    return tooltip;
  }
  remove(tooltip: Tooltip): void {
    const index = this.tooltips.indexOf(tooltip);
    if (index > -1) {
      this.tooltips.splice(index, 1);
    }
    tooltip.componentRef.destroy();
  }
}
