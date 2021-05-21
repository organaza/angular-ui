import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = (): void => {
  return;
};

@Component({
  selector: 'oz-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PagerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerComponent implements ControlValueAccessor {
  private _rowsNumber = 0;
  private _pageSize = 20;

  set currentPage(value: number) {
    this._currentPage = Number(value);
    this.onChangeCallback(value - 1);
  }
  get currentPage(): number {
    return this._currentPage;
  }
  _currentPage = 1;
  pageCount = 0;

  @Input()
  public set rowsCount(count: number) {
    this._rowsNumber = count;
    this.updatePageCount();
  }

  public get rowsCount(): number {
    return this._rowsNumber;
  }

  @Input()
  public set pageSize(size: number) {
    if (!size) {
      size = 1;
    }

    this.currentPage = 1;
    this._pageSize = size;
    this.updatePageCount();
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: number) => void = noop;

  constructor(private cd: ChangeDetectorRef) {}

  registerOnChange(fn: (_: number) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  writeValue(value: number): void {
    if (value) {
      this.currentPage = Number(value) + 1;
    } else {
      this.currentPage = 1;
    }
    this.cd.markForCheck();
  }

  private updatePageCount(): void {
    this.pageCount = Math.ceil(this.rowsCount / this.pageSize);
    this.cd.markForCheck();
  }

  private currentPageChanged(): void {
    this.onChangeCallback(this.currentPage - 1);
    this.cd.markForCheck();
  }

  public onClickFirst(): void {
    this.currentPage = 1;
    this.currentPageChanged();
  }

  public onClickPrev(): void {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.currentPageChanged();
    }
  }

  public onClickLast(): void {
    this.currentPage = this.pageCount;
    this.currentPageChanged();
  }

  public onClickNext(): void {
    if (this.currentPage < this.pageCount) {
      this.currentPage = this.currentPage + 1;
      this.currentPageChanged();
    }
  }
}
