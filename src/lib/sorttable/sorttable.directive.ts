import { Directive, Input, Output, ElementRef, EventEmitter, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';

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
  target: any;

  constructor(x: number, y: number, index?: number, target?: any) {
    this.x = x;
    this.y = y;
    this.index = index;
    this.target = target;
  }
}

export class SortStartEvent {
  index: number;
  target: any;

  constructor(index: number, target: any) {
    this.index = index;
    this.target = target;
  }
}


@Directive({
  selector: '[ozSortTable]'
})
export class SortTableDirective implements OnInit, OnDestroy {

  @Input() sortTable: string;
  @Input() sortTableCollection: any[];

  @Output()
  sortTableCompleted: EventEmitter<SortCompletedEvent> = new EventEmitter<SortCompletedEvent>();

  @Output()
  sortTableMove: EventEmitter<SortMoveEvent> = new EventEmitter<SortMoveEvent>();

  dragOffsetX: number;
  dragOffsetY: number;
  moveHandler: any;

  constructor(private el: ElementRef,
    private sortTableService: SortTableService,
    private renderer: Renderer2) {
  }

  ngOnInit() {
    this.sortTableService.registerCollection(this.sortTable, this);
  }
  ngOnDestroy() {
    this.sortTableService.unregisterCollection(this.sortTable);
  }
  setSort(oldIndex: number, newIndex: number) {
    if (this.sortTableCollection) {
      const dragItem: any = this.sortTableCollection.splice(oldIndex, 1)[0];
      this.sortTableCollection.splice(newIndex, 0, dragItem);
    }
    if (oldIndex !== newIndex) {
      this.sortTableCompleted.next(new SortCompletedEvent(oldIndex, newIndex));
    }
  }
  @HostListener('window:mouseup') onMouseUp() {
    this.sortTableService.stopDrag(this.sortTable);
    if (this.moveHandler) {
      this.moveHandler();
    }
  }
  @HostListener('mousedown', ['$event']) onMouseDown(downEvent: MouseEvent) {
    if (downEvent.button === 3) { // disable right click drag
      return false;
    }
    this.dragOffsetY = downEvent.pageY;
    this.dragOffsetX = downEvent.pageX;
    this.moveHandler = this.renderer.listen(this.el.nativeElement, 'mousemove', (moveEvent: MouseEvent) => {
      const offsetY = moveEvent.pageY - this.dragOffsetY;
      const offsetX = moveEvent.pageX - this.dragOffsetX;
      this.sortTableService.moveDrag(this.sortTable, offsetX, offsetY);
      this.sortTableMove.next(new SortMoveEvent(offsetX, offsetY));
    });
  }
}
