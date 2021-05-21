import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import {
  SortCompletedEvent,
  SortMoveEvent,
  SortStartEvent,
  SortTableDirective,
} from './sorttable.directive';
import { SortTableService } from './sorttable.service';

@Directive({
  selector: '[ozSortTableDragColumn]',
})
export class SortTableDragColumnDirective implements OnDestroy {
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

  @Input('ozSortTableDragColumn')
  set index(value: number) {
    if (this._index) {
      this.sortTableService.unregisterDragColumn(
        this.sortTable.sortTable,
        this.index,
      );
    }
    this._index = value;
    this.newIndex = value;
    if (value !== undefined) {
      window.setTimeout(() => {
        this.sortTableService.registerDragColumn(
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
    this.sortTableService.unregisterDragColumn(
      this.sortTable.sortTable,
      this.index,
    );
  }
  startSorting(): void {
    (this.el.nativeElement as HTMLElement).classList.add(
      'sorttable-column-move',
    );
    this.moveHandlerSort = this.renderer.listen(
      this.el.nativeElement as HTMLElement,
      'mousemove',
      (event: MouseEvent) => {
        const bounds: ClientRect = (this.el
          .nativeElement as HTMLElement).getBoundingClientRect();
        if (event.x > bounds.left && event.x < bounds.right) {
          this.sortTableService.moveOther(
            this.sortTable.sortTable,
            this.index,
            event.x - bounds.left,
            true,
          );
        }
      },
    );
  }
  stopSorting(): void {
    (this.el.nativeElement as HTMLElement).classList.remove(
      'sorttable-column-move',
    );
    (this.el.nativeElement as HTMLElement).style.transform =
      'translate3d(0px, 0px, 0px)';
    this.moveHandlerSort();
  }
  startDrag(): void {
    this.drag = true;
    this.offsetWidth = (this.el.nativeElement as HTMLElement).offsetWidth;
    this.offsetLeft = (this.el
      .nativeElement as HTMLElement).getBoundingClientRect().left;
    this.newIndex = this.index;
    (this.el.nativeElement as HTMLElement).classList.add(
      'sorttable-column-drag',
    );
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
      .nativeElement as HTMLElement).style.transform = `translate3d(${offset}px, 0px, 0px)`;
  }
  // Used to move current drag object
  moveDrag(offsetX: number, offsetY: number): void {
    this.sortMove.next(
      new SortMoveEvent(offsetX, offsetY, this.newIndex, this),
    );
    (this.el
      .nativeElement as HTMLElement).style.transform = `translate3d(${offsetX}px, 0px, 0px)`;
  }
  stopDrag(): void {
    this.drag = false;
    (this.el.nativeElement as HTMLElement).classList.remove(
      'sorttable-column-drag',
    );
    this.sortCompleted.next(new SortCompletedEvent(this.index, this.newIndex));
  }
  getWidth(): number {
    return (this.el.nativeElement as HTMLElement).offsetWidth;
  }
}
