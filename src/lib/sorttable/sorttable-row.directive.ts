import {
  Directive,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { SortTableService } from './sorttable.service';
import {
  SortCompletedEvent,
  SortStartEvent,
  SortMoveEvent,
  SortTableDirective,
} from './sorttable.directive';

@Directive({
  selector: '[ozSortTableRow]',
})
export class SortTableRowDirective implements OnDestroy {
  @Output()
  sortMove: EventEmitter<SortMoveEvent> = new EventEmitter<SortMoveEvent>();
  @Output()
  sortStart: EventEmitter<SortStartEvent> = new EventEmitter<SortStartEvent>();
  @Output()
  sortCompleted: EventEmitter<SortCompletedEvent> = new EventEmitter<SortCompletedEvent>();

  drag: boolean;
  offsetHeight: number;
  offsetTop: number;
  offsetWidth: number;
  offsetLeft: number;
  newIndex: number;
  _index: number;
  moveHandlerSort: () => void;
  moveHandlerDrag: () => void;

  constructor(
    private el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
    private renderer: Renderer2,
  ) {}

  @Input('ozSortTableRow')
  set index(value: number) {
    if (this._index) {
      this.sortTableService.unregisterRow(this.sortTable.sortTable, this.index);
    }
    this._index = value;
    this.newIndex = value;
    if (value !== undefined) {
      window.setTimeout(() => {
        this.sortTableService.registerRow(
          this.sortTable.sortTable,
          this.index,
          this,
        );
      });
    }
  }
  get index(): number {
    return this._index;
  }
  ngOnDestroy(): void {
    this.sortTableService.unregisterRow(this.sortTable.sortTable, this.index);
  }
  startSorting(): void {
    (this.el.nativeElement as HTMLElement).classList.add('sorttable-row-move');
    this.moveHandlerSort = this.renderer.listen(
      'window',
      'mousemove',
      (event: MouseEvent) => {
        const bounds: ClientRect = (this.el
          .nativeElement as HTMLElement).getBoundingClientRect();
        if (event.y > bounds.top && event.y < bounds.bottom) {
          this.sortTableService.moveOther(
            this.sortTable.sortTable,
            this.index,
            event.y - bounds.top,
          );
        }
      },
    );
  }
  stopSorting(): void {
    (this.el.nativeElement as HTMLElement).classList.remove(
      'sorttable-row-move',
    );
    (this.el.nativeElement as HTMLElement).style.transform =
      'translate3d(0px, 0px, 0px)';
    this.moveHandlerSort();
  }
  startDrag(): void {
    this.drag = true;
    this.offsetHeight = (this.el.nativeElement as HTMLElement).offsetHeight;
    this.offsetTop = (this.el
      .nativeElement as HTMLElement).getBoundingClientRect().top;
    this.newIndex = this.index;
    (this.el.nativeElement as HTMLElement).classList.add('sorttable-row-drag');
    if (this.moveHandlerSort) {
      this.moveHandlerSort();
    }
    this.sortStart.next(new SortStartEvent(this.index, this));
  }
  // Used to move another objects in collection
  offsetDrag(offset: number): void {
    if (this.drag) {
      return;
    }
    (this.el
      .nativeElement as HTMLElement).style.transform = `translate3d(0px, ${offset}px, 0px)`;
  }
  // Used to move current drag object
  moveDrag(offsetX: number, offsetY: number): void {
    this.sortMove.next(
      new SortMoveEvent(offsetX, offsetY, this.newIndex, this),
    );
    (this.el
      .nativeElement as HTMLElement).style.transform = `translate3d(0px, ${offsetY}px, 0px)`;
  }
  stopDrag(): void {
    this.drag = false;
    (this.el.nativeElement as HTMLElement).classList.remove(
      'sorttable-row-drag',
    );
    this.sortCompleted.next(new SortCompletedEvent(this.index, this.newIndex));
  }
  getHeight(): number {
    return (this.el.nativeElement as HTMLElement).offsetHeight;
  }
}
