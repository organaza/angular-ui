import { Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  OnDestroy} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

@Component({
  selector: 'oz-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PagerComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagerComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private _rowsNumber = 0;
  private _pageSize = 20;

  currentPage = 1;
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
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  writeValue(value: any) {
    this.currentPage = value;
    this.cd.markForCheck();
  }

  private updatePageCount() {
    this.pageCount = Math.ceil(this.rowsCount / this.pageSize);
    this.cd.markForCheck();
  }

  private currentPageChanged(): void {
    this.onChangeCallback(this.currentPage);
    this.cd.markForCheck();
  }

  public onClickFirst(): void {
    this.currentPage = 1;
    this.currentPageChanged();
  }

  public onClickPrev(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.currentPageChanged();
    }
  }

  public onClickLast(): void {
    this.currentPage = this.pageCount;
    this.currentPageChanged();
  }

  public onClickNext(): void {
    if (this.currentPage < this.pageCount ) {
      this.currentPage++;
      this.currentPageChanged();
    }
  }
}
