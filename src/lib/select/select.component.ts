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
import { JSONUtils } from '../json/json';
import { DropDownComponent } from '../dropdown/dropdown.component';

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

  @ViewChild('dropdown')
  dropdown: DropDownComponent;

  @ViewChild('input')
  input: ElementRef;

  @Input()
  @HostBinding()
  tabindex = 0;

  // formatter: BaseFormatter;
  value: any;
  labels: any[];
  plainLabels: string[];
  filteredOptions: any[];
  selectedIndex = 0;
  search = '';
  // Paging
  page: number;
  haveNextpage: boolean;
  // Original dictionary copy
  dictionaryOriginal: string;

  @Input()
  removeAddedInOptions = true;

  thisContext = {select: this};

  @HostBinding('class.oz-select-active') opened: boolean;
  loading: boolean;

  @Output()
  close = new EventEmitter();

  @Output()
  changed = new EventEmitter();

  @Input()
  dictionary: string;

  @Input()
  set format(value: string) {
    // this.formatter = this.formatService.getFormatterByName(value || 'Default');
  }

  @Input()
  set openByClick(value: boolean) {
    if (value) {
      this.switchPopup(true);
    }
  }

  @Input()
  tags: boolean;

  @Input()
  many: boolean;

  @Input()
  set requestFilters(value: any) {
    if (this._requestFilters && value && !JSONUtils.jsonCompare(this._requestFilters, value)) {
      this.options = [];
      this.optionsLoaded = false;
    }
    this._requestFilters = value;
  }
  get requestFilters(): any {
    return this._requestFilters;
  }
  _requestFilters = {};


  @Input()
  offlineFilter = false;

  @Input()
  manyLayout = 'horizontal';

  @Input()
  allowNull: boolean;

  @Input()
  disabled: boolean;

  @Input()
  set unformatOptions(value: any[]) {
    // if (this.formatter) {
    //   this.options = this.formatter.convertOption(value, this.requestFilters);
    // }
  }

  @Input()
  set options(value: any[]) {
    this._options = value;
    if (this.optionsLoaded) {
      this.optionsInited = true;
    }
  }
  get options(): any[] {
    return this._options;
  }
  _options: any[];

  @Input()
  optionsLoaded = false;

  optionsInited = false;

  @Input()
  filterFunction: any;

  @Input()
  limit: number;

  @Input()
  eraseAfterChange = false;

  @Input()
  createNewOption = false;

  @Input()
  hideActiveValue = false;

  @Input()
  expandedView = false;

  @Input()
  hideMoreThan = 1000;

  @Input()
  live = false;

  @Input()
  reloadOnOpen: boolean;

  @Input()
  useValidationValue = true;

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

  @Input()
  get emptyLabel(): string {
    return this._emptyLabel;
  }
  set emptyLabel(value: string) {
    this._emptyLabel = value;
    this.updateLabel();
  }
  _emptyLabel: string;

  @Input()
  set valueOtherNotChange(value: any) {
    this._valueOtherNotChange = value;
    this.updateValueOtherNotChange(true);
  }
  get valueOtherNotChange(): any {
    return this._valueOtherNotChange;
  }
  _valueOtherNotChange: any;

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
    if (value === undefined || value === null) {
      if (this.many) {
        value = [];
      } else {
        value = null;
      }
    }
    this.value = JSONUtils.jsonClone(value);
    // if (this.formatter) {
    //   this.value = this.formatter.convertToData(this.value);
      this.updateLabel();
    // }
    this.updateValueOtherNotChange(false);
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  applyChanges(data: any) {
    this.onChangeCallback(data);
    this.changed.next(data);
  }

  ngOnInit() {
    // this.selectOptions = this.dataService.dictionaries[this.dictionary];
    if (this.tags) {
      this.many = true;
    }
    if (!this.emptyLabel) {
      this.emptyLabel = '---';
    }
    if (this.many) {
      this.allowNull = false;
    }
    if (this.options) {
      // this.options = this.formatter.convertOption(this.options, this.requestFilters);
    }

    if (this.hideMoreThan < 1000) {
      this.removeAddedInOptions = false;
    }

    this.page = 1;
  }

  ngOnDestroy() {
    this.dropdown = null;
    // this.formatter = null;
    this.options = null;
    this.filteredOptions = null;
    this.labels = null;
    this.plainLabels = null;
    this.close.complete();
    this.close = null;
    this.requestFilters = null;
    this.unformatOptions = null;
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
      // this.applyChanges(this.formatter.getDataForSave(this.value));
      if (this.eraseAfterChange) {
        if (this.many) {
          this.value = [];
        } else {
          this.value = null;
        }

        this.updateLabel();
      }
      this.returnFocus();
    } else {
      if (this.reloadOnOpen && this.dictionary && this.optionsLoaded) {
        this.optionsLoaded = false;
        this.optionsInited = false;
        this.options = [];
      }
      this.opened = value;
      this.dropdown.show();
      this.focusOnInput();
      this.updateSearch();
    }
    this.cd.markForCheck();
  }
  clear() {
    if (this.many) {
      this.writeValue([]);
    } else {
      this.selectItem(null);
    }

  }
  get searchModel(): string {
    return this.search;
  }

  set searchModel(value: string) {
    this.search = value;
    if (!this.requestFilters) {
      this.requestFilters = {};
    }
    this.requestFilters.q = this.search;
    if (!this.offlineFilter) {
      this.optionsLoaded = false;
    }
    this.updateSearch();
  }
  setIndex(value: number) {
    this.selectedIndex = value;
  }
  onSearchKeyDown($event: any) {
    const optionsList = jQuery('.oz-select-dropdown .options');
    const activeOptionOffset = jQuery('.oz-select-dropdown .option.cursor').offset();
    const searchHeight = jQuery('.oz-select-dropdown .search').height();

    if ($event.keyCode === 13) {
      $event.preventDefault();
      this.onEnter();
      return false;
    }
    if ($event.keyCode === 27) {
      $event.preventDefault();
      this.switchPopup(false);
      return false;
    }
    if ($event.keyCode === 38) {
      if (this.tags) {
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
      } else {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      }
    }
    if ($event.keyCode === 40) {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredOptions.length - 1);
    }
    if (activeOptionOffset && optionsList) {
      optionsList.scrollTop(activeOptionOffset.top - optionsList.offset().top - searchHeight + optionsList.scrollTop());
    }
  }
  onEnter() {
    if (this.selectedIndex > -1 && this.filteredOptions.length > 0) {
      this.toggleItem(this.filteredOptions[this.selectedIndex]);
    } else if (this.createNewOption) {
      this.search = this.search.trim();
      this.toggleItem(this.search);
    }
    this.searchModel = '';
  }
  onPopupScroll($event: any) {
    const maxScroll = jQuery($event.target)[0].scrollHeight - jQuery($event.target).outerHeight();
    if (jQuery($event.target).scrollTop() > maxScroll - 10 && this.haveNextpage && !this.loading) {
      this.page++;
      this.loading = true;
      // this.dataService.loadDictionaryOptions(this.dictionary, this.requestFilters, this.page).subscribe((data: any) => {
      //   this.loading = false;
      //   this.haveNextpage = !!data.next;
      //   this.options = this.options.concat(this.formatter.convertOption(data.results, this.requestFilters));
      //   this.updateSearch();
      // });
    }
    $event.stopImmediatePropagation();
  }
  updateSearch() {
    if (this.tags) {
      this.selectedIndex = -1;
    }
    // Clear options if it differ
    if (this.dictionary !== this.dictionaryOriginal) {
      this.optionsLoaded = false;
      this.options = [];
    }
    // if have options and offlineFilter
    if (this.optionsLoaded && this.offlineFilter) {
      const filteredOptions: any[] = [];
      for (const option of this.options) {
        const contain = true;
        const nameParts = this.search.toLowerCase().split(' ');
        for (const namePart of nameParts) {
          // contain = contain && this.formatter.getDataForSearch(option).toLowerCase().indexOf(namePart) > -1;
        }

        const added: boolean = this.checkSelection(option);
        if (contain && !(added && this.removeAddedInOptions)) {
          filteredOptions.push(option);
        }
      }
      if (this.searchModel) {
        // filteredOptions.sort((a: any, b: any) => this.formatter.compareForSearch(a, b, this.search));
      }
      if (filteredOptions.length > this.hideMoreThan) {
        filteredOptions.sort((a: any, b: any) => this.sortSelectedTop(a, b));
      }
      this.filteredOptions = filteredOptions;
      if (this.filterFunction) {
        this.filteredOptions = this.filterFunction(this.filteredOptions);
      }
    } else if (this.optionsLoaded && !this.offlineFilter) {
      // if have options and filter online
      const filteredOptions: any[] = [];
      for (const option of this.options) {
        const added: boolean = this.checkSelection(option);
        if (!(added && this.removeAddedInOptions)) {
          filteredOptions.push(option);
        }
      }
      if (this.searchModel) {
        // filteredOptions.sort((a: any, b: any) => this.formatter.compareForSearch(a, b, this.search));
      }
      if (filteredOptions.length > this.hideMoreThan) {
        filteredOptions.sort((a: any, b: any) => this.sortSelectedTop(a, b));
      }
      this.filteredOptions = filteredOptions;
      if (this.filterFunction) {
        this.filteredOptions = this.filterFunction(this.filteredOptions);
      }
    } else if (this.dictionary) {
      // If dictionary is set load it
      this.loading = true;
      // this.dataService.loadDictionaryOptions(this.dictionary, this.requestFilters, this.page).subscribe((data: any) => {
      //   if (!this.formatter) {
      //     return;
      //   }
      //   this.loading = false;
      //   this.optionsLoaded = true;
      //   this.haveNextpage = !!data.next;
      //   this.options = (data.results) ? data.results : data;
      //   this.options = this.formatter.convertOption(this.options, this.requestFilters);
      //   this.dictionaryOriginal = this.dictionary;
      //   if (this.useValidationValue) {
      //     this.validationValue();
      //   }
      //   this.focusOnInput();
      //   this.updateSearch();
      //   this.cd.markForCheck();
      // });
    }
  }
  updateValueOtherNotChange(updateLabel: boolean) {
    // if (this.formatter) {
    //   this._valueOtherNotChange = this.formatter.convertToData(this._valueOtherNotChange);
    //   if (updateLabel) {
    //     this.updateLabel();
    //   }
    // }
  }
  selectItem(item: any) {
    if (typeof item === 'string' && item === '') {
      return;
    }
    if (this.many) {
      this.value.push(item);
      if (this.limit) {
        if (this.value.length > this.limit) {
          this.value.splice(0, this.value.length - this.limit);
        }
        if (this.value.length === this.limit) {
          this.searchModel = '';
          this.switchPopup(false);
        }
      }
    } else {
      this.value = item;
      this.searchModel = '';
      this.switchPopup(false);
    }
    this.updateLabel();
    this.updateSearch();
  }
  toggleItem(item: any) {
    if (this.checkSelection(item)) {
      this.removeItem(item);
    } else {
      if (this.getOptionsIndex(item) === -1 && this.createNewOption) {
        this.options.push(item);
      }
      this.selectItem(item);
    }
  }
  onRemoveItem($event: MouseEvent, item: any) {
    this.removeItem(item);
    $event.stopImmediatePropagation();
    $event.preventDefault();
    if (this.many) {
      $event.stopPropagation();
    }
  }
  removeItem(item: any) {
    if (!this.many && this.allowNull) {
      this.value = null;
    } else {
      this.value.splice(this.getValueIndex(item), 1);
    }
    this.updateLabel();
    this.updateSearch();
  }
  checkSelection(item: any) {
    if (item) {
      if (this.many) {
        return this.getValueIndex(item) > -1;
      } else {
        return this.getIDForItem(this.value) === this.getIDForItem(item);
      }
    }
    return false;
  }
  getValueIndex(item: any): number {
    return this.value.findIndex((element: any) => {
      return this.getIDForItem(element) === this.getIDForItem(item);
    });
  }
  getOptionsIndex(item: any): number {
    return this.options.findIndex((element: any) => {
      return this.getIDForItem(element) === this.getIDForItem(item);
    });
  }
  getLabelForItem(item: any) {
    // return this.formatter.getDataForDisplay(item);
  }
  getIDForItem(item: any) {
    // return this.formatter.getID(item);
  }
  updateLabel() {
    this.labels = [];
    this.plainLabels = [];
    for (const i in this.valueOtherNotChange) {
      if (this.valueOtherNotChange.hasOwnProperty(i)) {
        this.labels.push({
          label: this.getLabelForItem(this.valueOtherNotChange[i]),
          item: this.valueOtherNotChange[i],
          can_remove: false
        });
      }
    }
    if ((!this.value || this.value.length === 0) && (!this.valueOtherNotChange || this.valueOtherNotChange.length === 0)) {
      this.labels.push({ label: this.emptyLabel, item: null, can_remove: true, flag_empty: true });
      this.plainLabels.push(this.emptyLabel);
    } else {
      if (this.many) {
        for (const i in this.value) {
          if (this.value.hasOwnProperty(i)) {
            this.labels.push({ label: this.getLabelForItem(this.value[i]), item: this.value[i], can_remove: true });
            // this.plainLabels.push(this.getLabelForItem(this.value[i]));
          }
        }
      } else {
        this.labels.push({ label: this.getLabelForItem(this.value), item: this.value, can_remove: true });
        // this.plainLabels.push(this.getLabelForItem(this.value));
      }
    }
    if (this.live) {
      // this.applyChanges(this.formatter.getDataForSave(this.value));
    }
    this.cd.markForCheck();
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
  validationValue() {
    if (!this.useValidationValue) {
      return;
    }

    if (this.many && this.value) {
      const value = [];
      for (let v = 0; v < this.value.length; ++v) {
        if (this.options.find((val) => {
          if (val.id) {
            return val.id === this.value[v].id;
          }
          return val.label === this.value[v].label;
          })) {
          value.push(this.value[v]);
        }
      }
      const updateLabel = !JSONUtils.jsonCompare(value, this.value);
      this.value = value;
      if (updateLabel) {
        this.updateLabel();
      }
    } else if (this.value) {
      if (!this.options.find((val) => {
        if (val.id) {
          return val.id === this.value.id;
        }
        return val.label === this.value.label;
        })) {
        this.value = null;
        this.updateLabel();
      }
    }
  }
  returnFocus() {
    this.el.nativeElement.focus();
  }
  sortSelectedTop(a: any, b: any) {
    if (this.checkSelection(a)) {
      return -1;
    }
    if (this.checkSelection(b)) {
      return 1;
    }
    return 0;
  }
}
