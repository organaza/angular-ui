import {Directive, ElementRef, OnInit, OnDestroy, Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@Directive({
  selector: '[ozPreventParentScroll]'
})
export class PreventParentScrollDirective implements OnInit, OnDestroy {

  @Input()
  scrollDisabled = false;

  private mouseWheelEventHandler = (event: any) => this.onMouseWheel(event);

  constructor(private element: ElementRef) { }

  ngOnInit() {
    const element: Element = this.element.nativeElement;
    element.addEventListener('mousewheel', this.mouseWheelEventHandler);
    element.addEventListener('DOMMouseScroll', this.mouseWheelEventHandler);
  }

  ngOnDestroy() {
    const element: Element = this.element.nativeElement;
    element.removeEventListener('mousewheel', this.mouseWheelEventHandler);
    element.removeEventListener('DOMMouseScroll', this.mouseWheelEventHandler);
  }

  private onMouseWheel(event: any) {
    if (this.scrollDisabled) {
      return;
    }

    event.stopPropagation();
  }

  //   const element: any = this.element.nativeElement,
  //     scrollTop = element.scrollTop,
  //     scrollHeight = element.scrollHeight,
  //     height = element.clientHeight,
  //     delta = (event.type === 'DOMMouseScroll' ? event.detail * -40 : event.wheelDelta),
  //     up = delta > 0;

  //   const prevent = function() {
  //     event.stopPropagation();
  //     event.preventDefault();
  //     event.returnValue = false;
  //     return false;
  //   };
  //   console.log(delta, scrollHeight, height, scrollTop)

  //   if (!up && -delta > scrollHeight - height - scrollTop) {
  //     // Scrolling down, but this will take us past the bottom.
  //     element.scrollTop = scrollHeight;
  //     return prevent();
  //   } else if (up && delta > scrollTop) {
  //     // Scrolling up, but this will take us past the top.
  //     element.scrollTop = 0;
  //     return prevent();
  //   }
  // }
}
