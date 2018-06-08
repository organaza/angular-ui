import {
  ContentChild,
  TemplateRef,
  Renderer2,
  HostBinding,
  Component,
  Input,
  Output,
  ElementRef,
  OnDestroy,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'oz-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('state', [
      state('in-down', style({
        // transform: 'translateY(-12.5%) scaleY(0.75)',
        opacity: 0,
      })),
      state('in-up', style({
        // transform: 'translateY(12.5%) scaleY(0.75)',
        opacity: 0,
      })),
      state('show', style({
        // transform: 'translateY(0) scaleY(1)',
        opacity: 1,
      })),
      state('void', style({
        opacity: 0,
      })),

      transition('void => in-down', animate('0ms')),
      transition('void => in-up', animate('0ms')),
      transition('in-up => show', animate('150ms ease-out')),
      transition('in-down => show', animate('150ms ease-out')),
      transition('show => void', animate('150ms ease-out')),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DropDownComponent implements OnDestroy {
  @ContentChild('dropdownContent')
  dropdownContent: TemplateRef<any>;

  @HostBinding('style.left.px')
  left: number;
  @HostBinding('style.top.px')
  top: number;
  @HostBinding('style.right.px')
  right: number;
  @HostBinding('style.bottom.px')
  bottom: number;

  @HostBinding('style.width.px')
  width: number;
  @HostBinding('style.height.px')
  height: number;
  @HostBinding('style.max-height.px')
  maxHeight: number;
  @HostBinding('style.min-width.px')
  minWidth: number;

  @HostBinding('style.display')
  display = 'none';

  @HostBinding('style.flex-direction')
  flexDirection = 'column';

  @HostBinding('class.scroll')
  scroll = false;

  @Input()
  bindElement: HTMLElement;

  @Input()
  set activeElement(value: HTMLElement) {
    this._activeElement = value;
    this.setListeners();
  }
  get activeElement(): HTMLElement {
    return this._activeElement;
  }
  _activeElement: HTMLElement;

  @Input()
  useBindWidth: boolean;

  @Input()
  useBindWidthMin: boolean;

  @Input()
  bindInside = false;

  @Input()
  positionHorizontal = 'right-inside';

  @Input()
  positionVertical = 'down';

  @Input()
  absolute = true;

  @Input()
  mouseover = false;

  @Input()
  set position(value: any) {
    if (!value) {
      return;
    }
    this.__position = value;
    this.calculateBounds();
  }
  get position(): any {
    return this.__position;
  }
  __position: any;

  @Input()
  closeByClickActiveElement: boolean;

  @Input()
  displayBackground: boolean;

  @Input()
  closeByClickElement = true;

  @Output()
  displayed: EventEmitter<{}> = new EventEmitter();

  @Output()
  closed: EventEmitter<{}> = new EventEmitter();

  state = 'in-down';
  dropDownNgIf = false;

  openHandler: any;

  calculateTimeout: number;
  appendTimeout: number;
  dropDownTimeout: number;

  leaveDropdownHandler: Function;
  enterDropdownHandler: Function;
  leaveActiveHandler: Function;
  clickDropdownHandler: Function;
  leaveActiveHandlerByClickActiveElement: Function;

  parent: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) {
  }

  setListeners() {
    if (this.openHandler) {
      this.openHandler();
    }
    if (this.activeElement) {
      this.dropDownNgIf = false;
      if (this.mouseover) {
        this.openHandler = this.renderer.listen(this.activeElement, 'mouseover', (moveEvent: MouseEvent) => {
          this.openDropdownByClick();
        });
      } else {
        this.openHandler = this.renderer.listen(this.activeElement, 'mouseup', (moveEvent: MouseEvent) => {
          if (!this.dropDownNgIf) {
            moveEvent.stopImmediatePropagation();
            this.openDropdownByClick();
          }
        });
      }
    } else {
      // this.dropDownNgIf = true;
      // this.calculateBounds();
    }
    this.parent = this.el.nativeElement.parentElement;
    this.cd.markForCheck();
  }

  openDropdownByClick() {
    this.dropDownNgIf = true;
    this.calculateBounds();
    // setTimeout(() => {
      if (!this.displayBackground) {
        this.addLeaveDropdownHandler();
      }
      this.addEnterDropDownHandler();
    // }, 150);
    if (!this.displayBackground) {
      this.addLeaveActiveHandler();
    }
    if (this.closeByClickElement) {
      this.addClickDropdownHandler();
    }
    if (this.closeByClickActiveElement) {
      this.addLeaveActiveHandlerByClickActiveElement();
    }
    this.cd.markForCheck();
  }

  openDropdown() {
    if (!this.dropDownNgIf) {
    this.dropDownNgIf = true;
    this.calculateBounds();
    this.cd.markForCheck();
  }
  }

  closeDropdown() {
    if (this.state === 'void') {
      return;
    }
    this.setState('void');

    if (this.leaveDropdownHandler) {
      this.leaveDropdownHandler();
    }
    if (this.enterDropdownHandler) {
      this.enterDropdownHandler();
    }
    if (this.leaveActiveHandler) {
      this.leaveActiveHandler();
    }
    if (this.clickDropdownHandler) {
      this.clickDropdownHandler();
    }
    if (this.leaveActiveHandlerByClickActiveElement) {
      this.leaveActiveHandlerByClickActiveElement();
    }
    setTimeout(() => {
      if (this.absolute && this.parent) {
        this.parent.appendChild(this.el.nativeElement);
      }
      this.display = 'none';
      if (this.closed) {
        this.closed.next(true);
      }
      this.dropDownNgIf = false;
      this.cd.markForCheck();
    }, 150);
  }

  addLeaveDropdownHandler() {
    this.leaveDropdownHandler = this.renderer.listen(this.el.nativeElement, 'mouseleave', (moveEvent: MouseEvent) => {
      this.closeDropdown();
    });
  }

  addEnterDropDownHandler() {
    this.enterDropdownHandler = this.renderer.listen(this.el.nativeElement, 'mouseenter', (moveEvent: MouseEvent) => {
      this.dropDownNgIf = true;
      clearTimeout(this.dropDownTimeout);
      this.enterDropdownHandler();
      this.cd.markForCheck();
    });
  }

  addLeaveActiveHandler() {
    this.leaveActiveHandler = this.renderer.listen(this.activeElement, 'mouseleave', (moveEvent: MouseEvent) => {
      this.leaveActiveHandler();
      this.dropDownTimeout = window.setTimeout(() => {
        this.closeDropdown();
        this.enterDropdownHandler();
      }, 100);
    });
  }

  addClickDropdownHandler() {
    this.clickDropdownHandler = this.renderer.listen(this.el.nativeElement, 'mouseup', (moveEvent: MouseEvent) => {
      this.closeDropdown();
    });
  }

  addLeaveActiveHandlerByClickActiveElement() {
    this.leaveActiveHandlerByClickActiveElement = this.renderer.listen(this.activeElement, 'mouseup', (moveEvent: MouseEvent) => {
      this.closeDropdown();
      this.enterDropdownHandler();
      if (this.leaveActiveHandler) {
        this.leaveActiveHandler();
      }
    });
  }

  setState(newState: string) {
    this.state = newState;
    this.cd.markForCheck();
  }

  ngOnDestroy() {
    if (this.parent) {
      this.parent.appendChild(this.el.nativeElement);
    }
    clearTimeout(this.calculateTimeout);
    clearTimeout(this.appendTimeout);
    this.state = 'void';
    this.display = 'none';
    this.dropDownNgIf = false;
    this.cd.markForCheck();
    if (this.openHandler) {
      this.openHandler();
    }
    if (this.leaveDropdownHandler) {
      this.leaveDropdownHandler();
    }
    if (this.enterDropdownHandler) {
      this.enterDropdownHandler();
    }
    if (this.leaveActiveHandler) {
      this.leaveActiveHandler();
    }
    if (this.clickDropdownHandler) {
      this.clickDropdownHandler();
    }
    if (this.leaveActiveHandlerByClickActiveElement) {
      this.leaveActiveHandlerByClickActiveElement();
    }
    this.bindElement = null;
    this.activeElement = null;
    this.displayed.complete();
    this.closed.complete();
  }

  calculateBounds() {
    if (!this.bindElement) {
      return;
    }
    this.setState('void');
    this.display = 'flex';
    this.flexDirection = 'column';
    this.scroll = false;

    this.bottom = undefined;
    this.top = undefined;
    this.left = undefined;
    this.right = undefined;

    const bindWidth: number = this.bindElement.offsetWidth;
    const bindHeight: number = this.bindElement.offsetHeight;
    const bindOffset: ClientRect = this.bindElement.getBoundingClientRect();

    if (this.useBindWidth) {
      this.width = bindWidth;
    }

    if (this.useBindWidthMin) {
      this.minWidth = bindWidth;
    }

    this.calculateTimeout = window.setTimeout(() => {
      if (this.absolute) {
        window.document.body.appendChild(this.el.nativeElement);
      }

      const dropWidth: number = this.el.nativeElement.offsetWidth;
      const dropHeight: number = this.el.nativeElement.offsetHeight;
      const maxRight: number = window.innerWidth;
      const maxBottom: number = window.innerHeight;

      let top = 0;
      let bottom = 0;
      let canPlaceDown = true;
      let canPlaceUp = true;

      if (this.bindInside) {
        top = bindOffset.top;
      } else {
        top = bindOffset.top + bindHeight;
      }

      if (!this.absolute) {
        top = top - bindOffset.top;
      }

      if (top + dropHeight > maxBottom) {
        canPlaceDown = false;
      }


      if (this.bindInside) {
        bottom = maxBottom - bindOffset.top - bindHeight;
      } else {
        bottom = maxBottom - bindOffset.top;
      }

      if (!this.absolute) {
        bottom = bottom + bindOffset.top;
      }

      if (bottom + dropHeight > maxBottom) {
        canPlaceUp = false;
      }

      if (this.positionVertical === 'up' || canPlaceUp && !canPlaceDown) {
        this.setState('in-up');
        this.flexDirection = 'column-reverse';
        this.bottom = bottom;

        if (this.position && this.position.top) {
          this.bottom -= this.position.top;
        }
        this.maxHeight = maxBottom - this.bottom - 10;
      } else {
        this.setState('in-down');
        this.top = top - 1;
        if (this.position && this.position.top) {
          this.top -= (this.position.height - 4);
        }
        if (!canPlaceDown && this.absolute) {
          this.scroll = true;
          this.bottom = 20;
        } else if (!this.absolute) {
          this.maxHeight = maxBottom - this.top - 20;
        }
      }
      if (!this.absolute) {
        this.left = 0;
        if (this.position && this.position.left) {
          this.left = this.position.left;
        }
      } else if (this.position && this.position.left) {
        this.left = bindOffset.left + this.position.left;
      } else  {
        if (this.positionHorizontal === 'center') {
          this.left = bindOffset.left - ((dropWidth - bindWidth) / 2);
        }

        if (this.positionHorizontal === 'right-inside') {
          this.left = bindOffset.left;
        }

        if (this.positionHorizontal === 'right') {
          this.left = bindOffset.left + bindWidth;
        }

        if (this.positionHorizontal === 'left-inside') {
          this.left = bindOffset.left - dropWidth + bindWidth;
        }

        if (this.positionHorizontal === 'left') {
          this.left = bindOffset.left - dropWidth;
        }
      }

      if (this.left + dropWidth > maxRight) {
        this.left = maxRight - dropWidth - 10;
      }

      this.appendTimeout = window.setTimeout(() => {
        this.setState('show');
        this.displayed.next();
      }, 0);
    }, 0);
  }
  public show() {
    this.openDropdown();
  }
  public hide() {
    this.closeDropdown();
  }
}
