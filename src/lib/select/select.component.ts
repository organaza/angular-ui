import jQuery from 'jquery';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  TemplateRef,
  ContentChild,
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  forwardRef,
  HostBinding,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { ISelectModel } from './select.model';

const noop = () => {
};

export const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
};

@Component({
  selector: 'oz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [SELECT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  onTouchedCallback: () => void = noop;
  onChangeCallback: (_: any) => void = noop;

  loading: boolean;
  thisContext = {select: this};
  selectedIndex = -1;
  searchString: string;

  @Input()
  model: ISelectModel;

  @ViewChild('dropdown')
  dropdown: DropDownComponent;

  @ViewChild('input')
  input: ElementRef;

  @Input()
  @HostBinding()
  tabindex = 0;

  @HostBinding('class.oz-select-active')
  opened: boolean;

  @Output()
  close = new EventEmitter();

  @Output()
  changed = new EventEmitter();

  @Input()
  set openByClick(value: boolean) {
    if (value) {
      this.switchPopup(true);
    }
  }

  @Input()
  tags: boolean;

  @Input()
  manyLayout = 'horizontal';

  @Input()
  disabled: boolean;

  @Input()
  live = false;

  @Input()
  dropdownHorizontalPosition = 'right-inside';

  @ContentChild('selectedItemTemplateDefault')
  selectedItemTemplateDefault: TemplateRef<any>;

  @ContentChild('selectedItemActionsDefault')
  selectedItemActionsDefault: TemplateRef<any>;

  @ContentChild('selectedItemActions')
  selectedItemActions: TemplateRef<any>;

  @ContentChild('selectedItemTemplate')
  selectedItemTemplate: TemplateRef<any>;

  @ContentChild('lastItemTemplate')
  lastItemTemplate: TemplateRef<any>;

  @ContentChild('firstItemTemplate')
  firstItemTemplate: TemplateRef<any>;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    if (!this.opened) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.switchPopup(true);
      }
      return;
    }
    if (event.keyCode === 34 || event.keyCode === 33) {
      event.preventDefault();
      return false;
    }
  }


  constructor(private el: ElementRef,
    private cd: ChangeDetectorRef,
  ) {
  }

  writeValue(value: any) {
    this.model.setData(value);
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  applyChanges() {
    this.onChangeCallback(this.model.getData());
    this.changed.next(this.model.getData());
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.dropdown = null;
    this.close.complete();
    this.close = null;
    this.cd.markForCheck();
  }

  switchPopup(value?: boolean) {
    if (this.disabled) {
      return;
    }
    if (value === undefined) {
      value = !this.opened;
    }
    if (value === this.opened) {
      return;
    }
    if (!value) {
      this.opened = value;
      this.dropdown.hide();
      this.applyChanges();
      this.returnFocus();
    } else {
      this.model.show();
      this.opened = value;
      this.dropdown.show();
      this.focusOnInput();
    }
    this.cd.markForCheck();
  }
  setIndex(value: number) {
    this.selectedIndex = value;
  }
  onSearchKeyDown(event: KeyboardEvent) {
    const optionsList = jQuery('.oz-select-dropdown .options');
    const activeOptionOffset = jQuery('.oz-select-dropdown .option.cursor').offset();
    const searchHeight = jQuery('.oz-select-dropdown .search').height();

    if (event.key === 'Enter') {
      this.model.select(this.selectedIndex);
      event.preventDefault();
      return false;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.switchPopup(false);
      return false;
    }
    if (event.key === 'ArrowUp') {
      if (this.tags) {
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      } else {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
      event.preventDefault();
    }
    if (event.key === 'ArrowDown') {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.model.list.getValue().length - 1);
      event.preventDefault();
    }
    if (activeOptionOffset && optionsList) {
      optionsList.scrollTop(activeOptionOffset.top - optionsList.offset().top - searchHeight + optionsList.scrollTop());
    }
  }
  onEnter() {
  }
  onPopupScroll(event: any) {
    event.stopImmediatePropagation();
  }
  onRemoveItem(event: MouseEvent, index: number) {
    this.model.unselect(index);
    event.stopImmediatePropagation();
    event.preventDefault();
  }
  dropdownDisplayed() {
    this.focusOnInput();
  }
  focusOnInput() {
    window.setTimeout(() => {
      if (this.input) {
        this.input.nativeElement.focus();
      }
    }, 100);
  }
  returnFocus() {
    this.el.nativeElement.focus();
  }
  onLoadMore() {
    this.model.currentPage++;
    this.model.loadPage(this.model.currentPage).subscribe();
  }
}
