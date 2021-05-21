import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MentionsConfig } from 'oz-mentions';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

const noop = () => {
  return;
};

@Component({
  selector: 'oz-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextinputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextinputComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  destroy: Subject<boolean> = new Subject<boolean>();

  @HostBinding('class.focus')
  opened: boolean;

  @Input()
  @HostBinding()
  tabindex = 0;

  @Output()
  enter = new EventEmitter<void>();

  @Output()
  focused = new EventEmitter<void>();

  @Output()
  blured = new EventEmitter<void>();

  @Output()
  clear = new EventEmitter<void>();

  onModelChanged = new Subject<string | number>();

  @Input()
  opacity: number;

  @Input()
  live = false;

  @Input()
  liveDebounce = 0;

  @Input()
  prompt: string;

  @Input()
  type: 'string' | 'number' | 'float' = 'string';

  @Input()
  min = 0;

  @Input()
  max = Number.MAX_VALUE;

  @Input()
  maxlength: number;

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
  filterFunction: (value: string | number) => string;

  @Input()
  multiline: boolean;

  @Input()
  uppercase: boolean;

  @Input()
  mentionsConfig: MentionsConfig;

  focusOutTimeout: number;
  documentClickListener: () => void;
  textareaClickListener: () => void;

  oldValue: string | number;
  set value(value: string | number) {
    if (this.uppercase && value && typeof value === 'string') {
      this._value = value.toUpperCase();
    } else {
      this._value = value;
    }
  }
  get value(): string | number {
    if (this.uppercase && this._value && typeof this._value === 'string') {
      return this._value.toUpperCase();
    } else {
      return this._value;
    }
  }
  _value: string | number;

  @ViewChild('container', { read: ElementRef })
  container: ElementRef;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: string | number) => void = noop;

  @HostListener('keydown', ['$event'])
  onKeyDownListener(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.switchPopup(false, false, this.keepFocus);
      this.enter.next();
      if (event.key === 'Enter') {
        (this.container.nativeElement as HTMLElement).blur();
        event.preventDefault();
        return;
      }
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.switchPopup(false, true);
      (this.container.nativeElement as HTMLElement).blur();
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      return;
    }
  }

  @HostListener('focusin', ['$event'])
  onFocus(): void {
    this.switchPopup(true);
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
  ) {}

  writeValue(value: string): void {
    this.value = value;
    this.parseValue();
    if (this.onModelChanged) {
      this.cd.detectChanges();
    }
  }

  registerOnChange(fn: (_: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    this.textareaClickListener = this.renderer.listen(
      this.el.nativeElement,
      'click',
      (moveEvent: MouseEvent) => {
        moveEvent.stopPropagation();
      },
    );

    this.onModelChanged
      .pipe(
        debounceTime(this.liveDebounce),
        distinctUntilChanged(),
        takeUntil(this.destroy),
      )
      .subscribe((value: string) => {
        this.onChangeCallback(value);
      });
  }

  ngOnDestroy(): void {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
    if (this.textareaClickListener) {
      this.textareaClickListener();
    }
    this.enter.complete();
    this.focused.complete();
    this.blured.complete();
    this.destroy.next(true);
    this.onModelChanged.complete();
    this.onModelChanged = null;
    this.container = null;
  }

  switchPopup(
    value: boolean,
    omitChanges?: boolean,
    keepFocus?: boolean,
  ): void {
    if (this.disabled) {
      return;
    }
    if (value === this.opened) {
      return;
    }
    if (!value) {
      this.opened = false;
      if (!omitChanges) {
        this.parseValue();
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
        view: window,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);

      if (this.documentClickListener) {
        this.documentClickListener();
      }
      this.documentClickListener = this.renderer.listen(
        'window',
        'click',
        () => {
          this.onFocusOut();
        },
      );
    }
    this.cd.markForCheck();
  }

  onKeyDown(): void {
    if (this.live) {
      window.setTimeout(() => {
        this.parseValue();
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
      window.setTimeout(() => {
        this.parseValue();
      });
    }
  }

  onFocusOut(): void {
    this.switchPopup(false);
  }
  onFocusIn(): void {
    clearTimeout(this.focusOutTimeout);
  }

  focusOnInput(): void {
    window.setTimeout(() => {
      (this.container.nativeElement as HTMLElement).focus();
    });
  }
  getDisplayValue(): string {
    if (this.password && this.value && typeof this.value === 'string') {
      return this.value.replace(/./g, '•');
    } else {
      return (this.value || '').toString();
    }
  }
  onClear(event: MouseEvent): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.value = '';
    this.onChangeCallback(this.value);
    this.clear.next();
  }
  onPaste(): void {
    if (this.live) {
      window.setTimeout(() => {
        this.parseValue();
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
      window.setTimeout(() => {
        this.parseValue();
      });
    }
  }
  setFocus(): void {
    window.setTimeout(() => {
      if (this.container) {
        (this.container.nativeElement as HTMLElement).focus();
      }
    });
  }
  parseValue(): void {
    if (this.type !== 'number' && this.type !== 'float') {
      return;
    }
    this.value = this.value || '';
    this.checkAtMinMax();
    this.checkIsNaN();
    this.cd.markForCheck();
  }
  checkAtMinMax(): void {
    if (
      this.value &&
      this.type === 'float' &&
      typeof this.value === 'string' &&
      (this.value[this.value.length - 1] === '.' ||
        this.value[this.value.length - 1] === ',')
    ) {
      return;
    }
    if (this.type === 'number') {
      this.value = parseInt(this.value.toString(), 10);
    } else {
      this.value = parseFloat(this.value.toString());
    }
    if (this.value > this.max) {
      this.value = this.max;
    }
    if (this.value < this.min) {
      this.value = this.min;
    }
  }
  checkIsNaN(): void {
    if (this.type === 'number') {
      if (isNaN(Number(this.value))) {
        this.value = 0;
      }
    } else if (this.type === 'float') {
      if (isNaN(Number(this.value))) {
        this.value = null;
      }
    }
  }
  onBlur(): void {
    this.switchPopup(false);
    this.blured.next();
  }
}
