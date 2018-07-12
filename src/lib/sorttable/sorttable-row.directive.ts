import { Directive, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { SortTableService } from './sorttable.service';
import { SortCompletedEvent, SortStartEvent, SortMoveEvent, SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableRow]'
})
export class SortTableRowDirective implements OnInit, OnDestroy {
  @Output()
  sorted: EventEmitter<{}> = new EventEmitter();
  @Output()
  sortMove: EventEmitter<SortMoveEvent> = new EventEmitter<SortMoveEvent>();
  @Output()
  sortStart: EventEmitter<SortStartEvent> = new EventEmitter<SortStartEvent>();
  @Output()
  sortCompleted: EventEmitter<SortCompletedEvent> = new EventEmitter<SortCompletedEvent>();
  @Input() sortTableRowData: any;

  drag: boolean;
  offsetHeight: number;
  offsetTop: number;
  newIndex: number;
  _index: number;
  moveHandlerSort: any;
  moveHandlerDrag: any;

  constructor(private el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
    private renderer: Renderer2) {
  }

  @Input('ozSortTableRow')
  set index(value: number) {
    if (this._index) {
      this.sortTableService.unregisterRow(this.sortTable.sortTable, this.index);
    }
    this._index = value;
    this.newIndex = value;
    if (value !== undefined) {

      window.setTimeout(() => {
        this.sortTableService.registerRow(this.sortTable.sortTable, this.index, this);
      });
    }
  }
  get index(): number {
    return this._index;
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.sortTableService.unregisterRow(this.sortTable.sortTable, this.index);
  }
  startSorting() {
    this.el.nativeElement.classList.add('sorttable-row-move');
    this.moveHandlerSort = this.renderer.listen('window', 'mousemove', (event: MouseEvent) => {
      const bounds: ClientRect = this.el.nativeElement.getBoundingClientRect();
      if (event.y > bounds.top && event.y < bounds.bottom) {
        this.sortTableService.moveOther(this.sortTable.sortTable, this.index, event.y - bounds.top);
      }
    });
  }
  stopSorting() {
    this.el.nativeElement.classList.remove('sorttable-row-move');
    this.el.nativeElement.style.transform = 'translate3d(0px, 0px, 0px)';
    this.moveHandlerSort();
  }
  startDrag() {
    this.drag = true;
    this.offsetHeight = this.el.nativeElement.offsetHeight;
    this.offsetTop = this.el.nativeElement.getBoundingClientRect().top;
    this.newIndex = this.index;
    this.el.nativeElement.classList.add('sorttable-row-drag');
    if (this.moveHandlerSort) {
      this.moveHandlerSort();
    }
    this.sortStart.next(new SortStartEvent(this.index, this));
  }
  // Used to move another objects in collection
  offsetDrag(offset: number) {
    if (this.drag) {
      return;
    }
    this.el.nativeElement.style.transform = 'translate3d(0px,' + (offset) + 'px, 0px)';
  }
  // Used to move current drag object
  moveDrag(offsetX: number, offsetY: number) {
    this.sortMove.next(new SortMoveEvent(offsetX, offsetY, this.newIndex, this));
    this.el.nativeElement.style.transform = 'translate3d(0px,' + (offsetY) + 'px, 0px)';
  }
  stopDrag() {
    this.drag = false;
    this.el.nativeElement.classList.remove('sorttable-row-drag');
    this.sortCompleted.next(new SortCompletedEvent(this.index, this.newIndex));
  }
  getHeight(): number {
    return this.el.nativeElement.offsetHeight;
  }
}
