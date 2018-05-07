import { Directive, Input, ElementRef, HostListener, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';
import { SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableColumnHead]'
})
export class SortTableColumnHeadDirective implements OnInit, OnDestroy {

  @Input() sortTableColumnHead: string;

  get columnId(): string {
    return this.sortTable.sortTable + ':' + this.sortTableColumnHead;
  }

  drag = false;
  prevScreenX = 0;
  moveGlobal: any;
  upGlobal: any;

  constructor(
    public el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.sortTableService.registerColumnHead(this.columnId, this);
  }
  ngOnDestroy() {
    this.sortTableService.unregisterColumnHead(this.columnId);
  }

  // Set flex basis from service
  setFlexBasisHead(flexBasis: string) {
    this.el.nativeElement.style.flexBasis = flexBasis + '%';
  }

  @HostListener('mousemove', ['$event.layerX'])
  onMouseMove(layerX: any) {
    if (layerX > this.el.nativeElement.offsetWidth - 10) {
      this.el.nativeElement.style.cursor = 'ew-resize';
    } else {
      this.el.nativeElement.style.cursor = '';
    }
  }
  @HostListener('mousedown', ['$event.layerX', '$event.screenX', '$event.which'])
  onMouseDown(layerX: number, screenX: any, which: any) {
    if (which === 3) { // disable right click drag
      return false;
    }
    if (layerX > this.el.nativeElement.offsetWidth - 10) {
      this.prevScreenX = screenX;
      this.moveGlobal = this.renderer.listen('window', 'mousemove', (event: MouseEvent) => {
        const deltaX = this.prevScreenX - event.screenX;
        this.prevScreenX = event.screenX;
        // On resize call service
        this.sortTableService.resizeColumnHead(this.columnId, deltaX);
      });
      this.upGlobal = this.renderer.listen('window', 'mouseup', () => {
        this.moveGlobal();
        this.upGlobal();
      });
    }
  }
  getWidth(): number {
    return this.el.nativeElement.offsetWidth;
  }
}
