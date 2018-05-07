import { Directive, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';
import { SortCompletedEvent, SortStartEvent, SortMoveEvent, SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableDragColumn]'
})
export class SortTableDragColumnDirective implements OnInit, OnDestroy {
  @Output()
  sorted: EventEmitter<{}> = new EventEmitter();
  @Output()
  sortMove: EventEmitter<SortMoveEvent> = new EventEmitter<SortMoveEvent>();
  @Output()
  sortStart: EventEmitter<SortStartEvent> = new EventEmitter<SortStartEvent>();
  @Output()
  sortCompleted: EventEmitter<SortCompletedEvent> = new EventEmitter<SortCompletedEvent>();

  drag: boolean;
  offsetWidth: number;
  offsetLeft: number;
  newIndex: number;
  _index: number;
  moveHandlerSort: any;
  moveHandlerDrag: any;

  constructor(private el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
    private renderer: Renderer2) {
  }

  @Input('sortTableDragColumn')
  set sortTableDragColumn(value: number) {
    if (this._index) {
      this.sortTableService.unregisterDragColumn(this.sortTable.sortTable, this.sortTableDragColumn);
    }
    this._index = value;
    this.newIndex = value;
    if (value !== undefined) {
      window.setTimeout(() => {
        this.sortTableService.registerDragColumn(this.sortTable.sortTable, this.sortTableDragColumn, this);
      });
    }
  }
  get sortTableDragColumn(): number {
    return this._index;
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.sortTableService.unregisterDragColumn(this.sortTable.sortTable, this.sortTableDragColumn);
  }
  startSorting() {
    this.el.nativeElement.classList.add('sorttable-column-move');
    this.moveHandlerSort = this.renderer.listen(this.el.nativeElement, 'mousemove', (event: MouseEvent) => {
      const bounds: ClientRect = this.el.nativeElement.getBoundingClientRect();
      if (event.x > bounds.left && event.x < bounds.right) {
        this.sortTableService.moveOther(this.sortTable.sortTable, this.sortTableDragColumn, event.x - bounds.left, true);
      }
    });
  }
  stopSorting() {
    this.el.nativeElement.classList.remove('sorttable-column-move');
    this.el.nativeElement.style.transform = 'translate3d(0px, 0px, 0px)';
    this.moveHandlerSort();
  }
  startDrag() {
    this.drag = true;
    this.offsetWidth = this.el.nativeElement.offsetWidth;
    this.offsetLeft = this.el.nativeElement.getBoundingClientRect().left;
    this.newIndex = this.sortTableDragColumn;
    this.el.nativeElement.classList.add('sorttable-column-drag');
    if (this.moveHandlerSort) {
      this.moveHandlerSort();
    }
    this.sortStart.next(new SortStartEvent(this.sortTableDragColumn, this));
  }
  // Used to move another objects in collection
  offsetDrag(offset: number) {
    if (this.drag) {
      return;
    }
    this.el.nativeElement.style.transform = 'translate3d(' + (offset) + 'px, 0px, 0px)';
  }
  // Used to move current drag object
  moveDrag(offsetX: number, offsetY: number) {
    this.sortMove.next(new SortMoveEvent(offsetX, offsetY, this.newIndex, this));
    this.el.nativeElement.style.transform = 'translate3d(' + (offsetX) + 'px, 0px, 0px)';
  }
  stopDrag() {
    this.drag = false;
    this.el.nativeElement.classList.remove('sorttable-column-drag');
    this.sortCompleted.next(new SortCompletedEvent(this.sortTableDragColumn, this.newIndex));
  }
  // getHeight не нашел где используется
  // getWidth(): number {
  //   return this.el.nativeElement.offsetWidth;
  // }
}
