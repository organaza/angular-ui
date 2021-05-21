import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[ozPreventParentScroll]',
})
export class PreventParentScrollDirective implements OnInit, OnDestroy {
  @Input()
  scrollDisabled = false;

  private mouseWheelEventHandler = (event: WheelEvent) =>
    this.onMouseWheel(event);

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    (this.element.nativeElement as HTMLElement).addEventListener(
      'mousewheel',
      this.mouseWheelEventHandler,
    );
    (this.element.nativeElement as HTMLElement).addEventListener(
      'DOMMouseScroll',
      this.mouseWheelEventHandler,
    );
  }

  ngOnDestroy(): void {
    (this.element.nativeElement as HTMLElement).removeEventListener(
      'mousewheel',
      this.mouseWheelEventHandler,
    );
    (this.element.nativeElement as HTMLElement).removeEventListener(
      'DOMMouseScroll',
      this.mouseWheelEventHandler,
    );
  }

  private onMouseWheel(event: WheelEvent) {
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

  //   const prevent = function():void {
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
