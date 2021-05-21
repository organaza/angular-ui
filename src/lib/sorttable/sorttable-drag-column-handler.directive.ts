import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';
import { SortTableDirective } from './sorttable.directive';
import { SortTableService } from './sorttable.service';

@Directive({
  selector: '[ozSortTableDragColumnHandler]',
})
export class SortTableDragColumnHandlerDirective {
  @Input('ozSortTableDragColumnHandler') sortTableDragColumnHandler: number; // eslint-disable-line  @angular-eslint/no-input-rename

  @Input()
  canSort = true;

  constructor(
    private el: ElementRef,
    private sortTableService: SortTableService,
    private sortTableDragColumn: SortTableDragColumnDirective,
    private sortTable: SortTableDirective,
  ) {}
  @HostListener('mousedown', ['$event.which']) onMouseDown(
    which: number,
  ): void {
    if (!this.canSort) {
      return;
    }
    if (which === 3) {
      // disable right click drag
      return;
    }
    this.sortTableService.startDrag(
      this.sortTable.sortTable,
      this.sortTableDragColumn.index,
    );
  }
}
