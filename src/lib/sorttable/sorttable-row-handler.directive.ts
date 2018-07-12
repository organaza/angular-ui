import { Directive, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { SortTableService } from './sorttable.service';
import { SortTableDirective } from './sorttable.directive';
import { SortTableRowDirective } from './sorttable-row.directive';

@Directive({
  selector: '[ozSortTableRowHandler]'
})
export class SortTableRowHandlerDirective {
  @Input('ozSortTableRowHandler') sortTableRowHandler: number;  // tslint:disable-line no-input-rename

  @Input()
  canSort = true;

  @Output()
  sorted: EventEmitter<{}> = new EventEmitter();

  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private sortTableService: SortTableService,
    private sortTableRow: SortTableRowDirective,
    private sortTable: SortTableDirective) {
    this.el = el.nativeElement;
  }
  @HostListener('mousedown', ['$event.which']) onMouseDown(which: any) {
    if (!this.canSort) {
      return;
    }
    if (which === 3) { // disable right click drag
      return false;
    }
    this.sortTableService.startDrag(this.sortTable.sortTable, this.sortTableRow.index);
  }
}
