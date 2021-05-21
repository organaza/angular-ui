import {
  Directive,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';
import { SortTableRowDirective } from './sorttable-row.directive';
import { SortTableService } from './sorttable.service';

export class SortCompletedEvent {
  oldIndex: number;
  newIndex: number;

  constructor(oldIndex: number, newIndex: number) {
    this.oldIndex = oldIndex;
    this.newIndex = newIndex;
  }
}

export class SortMoveEvent {
  x: number;
  y: number;
  index: number;
  target: SortTableRowDirective | SortTableDragColumnDirective;

  constructor(
    x: number,
    y: number,
    index?: number,
    target?: SortTableRowDirective | SortTableDragColumnDirective,
  ) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.target = target;
  }
}

export class SortStartEvent {
  index: number;
  target: SortTableRowDirective | SortTableDragColumnDirective;

  constructor(
    index: number,
    target: SortTableRowDirective | SortTableDragColumnDirective,
  ) {
    this.index = index;
    this.target = target;
  }
}

@Directive({
  selector: '[ozSortTable]',
})
export class SortTableDirective implements OnInit, OnDestroy {
  @Input('ozSortTable') sortTable: string; // eslint-disable-line  @angular-eslint/no-input-rename
  @Input() sortTableCollection: Array<unknown>;

  @Output()
  sortTableCompleted: EventEmitter<SortCompletedEvent> = new EventEmitter<SortCompletedEvent>();

  @Output()
  sortTableMove: EventEmitter<SortMoveEvent> = new EventEmitter<SortMoveEvent>();

  dragOffsetX: number;
  dragOffsetY: number;
  moveHandler: () => void;

  constructor(
    private el: ElementRef,
    private sortTableService: SortTableService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.sortTableService.registerCollection(this.sortTable, this);
  }
  ngOnDestroy(): void {
    this.sortTableService.unregisterCollection(this.sortTable);
  }
  setSort(oldIndex: number, newIndex: number): void {
    if (this.sortTableCollection) {
      const dragItem: unknown = this.sortTableCollection.splice(oldIndex, 1)[0];
      this.sortTableCollection.splice(newIndex, 0, dragItem);
    }
    if (oldIndex !== newIndex) {
      this.sortTableCompleted.next(new SortCompletedEvent(oldIndex, newIndex));
    }
  }
  @HostListener('window:mouseup') onMouseUp(): void {
    this.sortTableService.stopDrag(this.sortTable);
    if (this.moveHandler) {
      this.moveHandler();
    }
  }
  @HostListener('mousedown', ['$event']) onMouseDown(
    downEvent: MouseEvent,
  ): void {
    if (downEvent.button === 3) {
      // disable right click drag
      return;
    }
    this.dragOffsetY = downEvent.pageY;
    this.dragOffsetX = downEvent.pageX;
    this.moveHandler = this.renderer.listen(
      this.el.nativeElement,
      'mousemove',
      (moveEvent: MouseEvent) => {
        const offsetY = moveEvent.pageY - this.dragOffsetY;
        const offsetX = moveEvent.pageX - this.dragOffsetX;
        this.sortTableService.moveDrag(this.sortTable, offsetX, offsetY);
        this.sortTableMove.next(new SortMoveEvent(offsetX, offsetY));
      },
    );
  }
}
