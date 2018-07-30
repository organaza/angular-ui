import {
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  HostBinding,
  forwardRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

const noop = () => {
};

@Component({
  selector: 'oz-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextinputComponent),
  multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TextinputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  destroy: Subject<boolean> = new Subject<boolean>();

  @HostBinding('class.focus')
  opened: boolean;

  @Input()
  @HostBinding()
  tabindex = 0;

  @Output()
  enter: EventEmitter<{}> = new EventEmitter();

  @Output()
  focus: EventEmitter<{}> = new EventEmitter();

  @Output()
  blur: EventEmitter<{}> = new EventEmitter();

  onModelChanged: Subject<any> = new Subject<any>();

  @Input()
  opacity: number;

  @Input()
  live = false;

  @Input()
  liveDebounce = 0;

  @Input()
  prompt: string;

  @Input()
  type = 'string';

  @Input()
  min = 0;

  @Input()
  max = 100;

  @Input()
  maxlength: any;

  @Input()
  @HostBinding('class.disabled')
  disabled: boolean;

  @Input()
  showClear = false;

  @Input()
  @HostBinding('class.borderless')
  borderless = false;

  @Input()
  percentage: boolean;

  @Input()
  set password(value: boolean) {
    this.__password = value;
    if (value) {
      this.inputType = 'password';
    } else {
      this.inputType = 'text';
    }
  }
  get password(): boolean {
    return this.__password;
  }
  inputType: string;
  __password: boolean;

  @Input()
  eraseAfterChange = false;

  @Input()
  nopadding: boolean;

  @Input()
  keepFocus: boolean;

  @Input()
  filterFunction: any;

  @Input()
  multiline: boolean;

  @Input()
  uppercase: boolean;

  focusOutTimeout: number;
  documentClickListener: Function;
  textareaClickListener: Function;

  oldValue: any;
  set value(value: any) {
    if (this.uppercase && value) {
      this._value = value.toUpperCase();
    } else {
      this._value = value;
    }
  }
  get value(): any {
    if (this.uppercase && this._value) {
      return this._value.toUpperCase();
    } else {
      return this._value;
    }
  }
  _value: any;

  @ViewChild('container')
  container: ElementRef;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @HostListener('keydown', ['$event'])
  onKeyDownListener(event: any) {
    if (event.code === 'Enter' || event.code === 'Tab') {
      this.enter.next();
      this.switchPopup(false, false, this.keepFocus);
      this.container.nativeElement.blur();
      if (event.code === 'Enter') {
        event.preventDefault();
        return false;
      }
    }
    if (event.code === 'Escape') {
      event.preventDefault();
      this.switchPopup(false, true);
      this.container.nativeElement.blur();
      return false;
    }
    if (event.code === 'PageUp' || event.code === 'PageDown') {
      event.preventDefault();
      return false;
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any) {
    this.switchPopup(true);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) { }

  writeValue(value: any) {
    this.value = value;
    this.checkNumber();
    if (this.onModelChanged) {
      this.cd.detectChanges();
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.textareaClickListener = this.renderer.listen(this.el.nativeElement, 'click', (moveEvent: MouseEvent) => {
      moveEvent.stopPropagation();
    });

    this.onModelChanged.pipe(
      takeUntil(this.destroy),
      debounceTime(this.liveDebounce),
      distinctUntilChanged(),
    )
    .subscribe((value: any) => {
      this.onChangeCallback(value);
    });

  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
    if (this.textareaClickListener) {
      this.textareaClickListener();
    }
    this.enter.complete();
    this.focus.complete();
    this.blur.complete();
    this.destroy.next(true);
    this.onModelChanged.complete();
    this.onModelChanged = null;
    this.container = null;
  }

  switchPopup(value: boolean, omitChanges?: boolean, keepFocus?: boolean) {
    if (this.disabled) {
      return;
    }
    if (value === this.opened) {
      return;
    }
    if (!value) {
      this.opened = false;
      if (!omitChanges) {
        this.checkNumber();
        if (this.filterFunction) {
          this.value = this.filterFunction(this.value);
        }
        if (this.liveDebounce > 0) {
          if (this.onModelChanged) {
            this.onModelChanged.next(this.value);
          }
        } else {
          this.onChangeCallback(this.value);
        }
        if (this.eraseAfterChange) {
          this.value = null;
        }
      } else {
        this.value = this.oldValue;
      }
      if (keepFocus) {
        this.opened = true;
      } else if (!keepFocus) {
        if (this.documentClickListener) {
          this.documentClickListener();
        }
      }
    } else {
      this.opened = true;
      this.oldValue = this.value;
      this.focusOnInput();

      const event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      window.dispatchEvent(event);

      if (this.documentClickListener) {
        this.documentClickListener();
      }
      this.documentClickListener = this.renderer.listen('window', 'click', (moveEvent: MouseEvent) => {
        this.onFocusOut();
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.live) {
      setTimeout(() => {
        this.checkNumber();
        if (this.filterFunction) {
          this.value = this.filterFunction(this.value);
        }
        if (this.liveDebounce > 0) {
          this.onModelChanged.next(this.value);
        } else {
          this.onChangeCallback(this.value);
        }
      });
    } else {
      setTimeout(() => {
        this.checkNumber();
      });
    }
  }

  onFocusOut() {
    this.switchPopup(false);
  }
  onFocusIn() {
    clearTimeout(this.focusOutTimeout);
  }

  focusOnInput() {
    setTimeout(() => {
      this.container.nativeElement.focus();
    });
  }
  getDisplayValue(): string {
    if (this.password && this.value) {
      return this.value.replace(/./g, '•');
    } else {
      return this.value;
    }
  }
  clear(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.value = '';
    if (this.liveDebounce > 0) {
      this.onModelChanged.next(this.value);
    } else {
      this.onChangeCallback(this.value);
    }
  }
  onPaste(event: any) {
    if (this.live) {
      setTimeout(() => {
        this.checkNumber();
        if (this.filterFunction) {
          this.value = this.filterFunction(this.value);
        }
        if (this.liveDebounce > 0) {
          this.onModelChanged.next(this.value);
        } else {
          this.onChangeCallback(this.value);
        }
      });
    } else {
      setTimeout(() => {
        this.checkNumber();
      });
    }
  }
  setFocus() {
    setTimeout(() => {
      if (this.container) {
        this.container.nativeElement.focus();
      }
    });
  }
  checkNumber() {
    if (this.type !== 'number' && this.type !== '*number') {
      return;
    }
    this.checkAtMinMax();
    this.checkIsNaN();
    this.cd.markForCheck();
  }
  checkAtMinMax() {
    if (this.value && this.type === '*number' && (this.value[this.value.length - 1] === '.' || this.value[this.value.length - 1] === ',')) {
      return;
    }
    if (this.type === 'number') {
      this.value = parseInt(this.value, 10);
    } else {
      this.value = parseFloat(this.value);
    }
    if (this.value > this.max) {
      this.value = this.max;
    }
    if (this.value < this.min) {
      this.value = this.min;
    }
  }
  checkIsNaN() {
    if (this.type === 'number') {
      if (isNaN(this.value)) {
        this.value = 0;
      }
    } else if (this.type === '*number') {
      if (isNaN(this.value)) {
        this.value = null;
      }
    }
  }
  onBlur() {
    this.switchPopup(false);
    this.blur.next();
  }
}
