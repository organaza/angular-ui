import { Directive, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';
import { SortTableDirective } from './sorttable.directive';
import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';

@Directive({
  selector: '[ozSortTableDragColumnHandler]'
})
export class SortTableDragColumnHandlerDirective {
  @Input()
  sortTableDragColumnHandler: number;

  @Input()
  canSort = true;

  @Output()
  sorted: EventEmitter<{}> = new EventEmitter();

  private el: HTMLElement;

  constructor(
    el: ElementRef,
    private sortTableService: SortTableService,
    private sortTableDragColumn: SortTableDragColumnDirective,
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
    this.sortTableService.startDrag(this.sortTable.sortTable, this.sortTableDragColumn.sortTableDragColumn);
  }
}
