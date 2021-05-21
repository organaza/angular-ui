import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { OzSettingsService } from '../settings/settings.service';
import { ISelectItem, ISelectModel, SelectData } from './select.model';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnDestroy, ControlValueAccessor {
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: SelectData) => void = noop;

  loading: boolean;
  thisContext: { select: SelectComponent };
  selectedIndex = 0;
  searchString: string;

  modelChanged: Subject<boolean> = new Subject();

  @Input()
  set model(value: ISelectModel) {
    this.modelChanged.next(true);
    this._model = value;
    this.model.selected
      .pipe(takeUntil(this.modelChanged))
      .subscribe(() => void this.applyChanges());
  }
  get model(): ISelectModel {
    return this._model;
  }

  _model: ISelectModel;

  @Input()
  iconClosed: string;

  @Input()
  iconOpened: string;

  @ViewChild('dropdown', { static: true })
  dropdown: DropDownComponent;

  @ViewChild('input', { static: true })
  input: ElementRef;

  @Input()
  @HostBinding()
  tabindex = 0;

  @HostBinding('class.oz-select-active')
  opened: boolean;

  // @Output()
  // close = new EventEmitter();

  @Output()
  changed = new EventEmitter();

  @Output()
  itemChange = new EventEmitter<ISelectItem[]>();

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
  closeOnSelect = true;

  @Input()
  live = false;

  @Input()
  dropdownHorizontalPosition = 'right-inside';

  @ContentChild('selectedItemTemplateDefault', { static: true })
  selectedItemTemplateDefault: TemplateRef<unknown>;

  @ContentChild('selectedItemActionsDefault', { static: true })
  selectedItemActionsDefault: TemplateRef<unknown>;

  @ContentChild('selectedItemActions', { static: true })
  selectedItemActions: TemplateRef<unknown>;

  @ContentChild('selectedItemTemplate', { static: true })
  selectedItemTemplate: TemplateRef<unknown>;

  @ContentChild('lastItemTemplate', { static: true })
  lastItemTemplate: TemplateRef<unknown>;

  @ContentChild('firstItemTemplate', { static: true })
  firstItemTemplate: TemplateRef<unknown>;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.opened) {
      if (event.key === 'Space' || event.key === 'Enter') {
        this.switchPopup(true);
      }
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      return;
    }
  }

  constructor(
    private el: ElementRef,
    private settingService: OzSettingsService,
    private cd: ChangeDetectorRef,
  ) {
    this.thisContext = { select: this };
    this.iconClosed = this.settingService.selectIconDown;
    this.iconOpened = this.settingService.selectIconUp;
  }

  writeValue(value: SelectData): void {
    this.model.setData(value);
  }

  registerOnChange(fn: (_: SelectData) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  async applyChanges(): Promise<void> {
    this.onChangeCallback(this.model.getData());
    this.itemChange.next(await this.model.selected.toPromise());
    this.changed.next(this.model.getData());
  }

  ngOnDestroy(): void {
    this.dropdown = null;
    // this.close.complete();
    // this.close = null;
    this.cd.markForCheck();
  }

  switchPopup(value?: boolean): void {
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
      void this.applyChanges();
      this.returnFocus();
    } else {
      this.model.show();
      this.opened = value;
      this.dropdown.show();
      this.focusOnInput();
    }
    this.cd.markForCheck();
  }
  setIndex(value: number): void {
    this.selectedIndex = value;
  }
  async onSearchKeyDown(event: KeyboardEvent): Promise<void> {
    const optionsList = (this.dropdown.el
      .nativeElement as HTMLElement).getElementsByClassName(
      'options',
    )[0] as HTMLElement;
    const activeOption = (this.dropdown.el
      .nativeElement as HTMLElement).getElementsByClassName(
      'option cursor',
    )[0] as HTMLElement;
    const searchElement = (this.dropdown.el
      .nativeElement as HTMLElement).getElementsByClassName(
      'search',
    )[0] as HTMLElement;

    if (event.key === 'Enter') {
      this.model.select(this.selectedIndex);
      event.preventDefault();
      if (this.closeOnSelect) {
        this.switchPopup(false);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.switchPopup(false);
      return;
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
      this.selectedIndex = Math.min(
        this.selectedIndex + 1,
        (await this.model.list.toPromise()).length - 1,
      );
      event.preventDefault();
    }
    if (activeOption && optionsList) {
      const activeOptionRect = activeOption.getBoundingClientRect();
      const optionsListRect = optionsList.getBoundingClientRect();
      const searchHeight = searchElement ? searchElement.offsetHeight : 0;
      optionsList.scrollTop =
        activeOptionRect.top -
        optionsListRect.top -
        searchHeight +
        optionsList.scrollTop;
    }
  }
  onPopupScroll(event: Event): void {
    event.stopImmediatePropagation();
  }
  onRemoveItem(event: MouseEvent, index: number): void {
    this.model.unselect(index);
    event.stopImmediatePropagation();
    event.preventDefault();
  }
  onSelect(index: number): void {
    this.model.select(index);
    if (this.closeOnSelect) {
      this.switchPopup(false);
    }
  }
  dropdownDisplayed(): void {
    this.focusOnInput();
  }
  focusOnInput(): void {
    window.setTimeout(() => {
      if (this.input) {
        (this.input.nativeElement as HTMLElement).focus();
      }
    }, 100);
  }
  returnFocus(): void {
    (this.el.nativeElement as HTMLElement).focus();
  }
  onLoadMore(): void {
    this.model.currentPage++;
    this.model.loadPage(this.model.currentPage).subscribe();
  }
}
