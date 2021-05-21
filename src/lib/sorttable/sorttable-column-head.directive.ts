import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { SortTableService } from './sorttable.service';
import { SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableColumnHead]',
})
export class SortTableColumnHeadDirective implements OnInit, OnDestroy {
  @Input('ozSortTableColumnHead') sortTableColumnHead: string; // eslint-disable-line  @angular-eslint/no-input-rename

  get columnId(): string {
    return this.sortTable.sortTable + ':' + this.sortTableColumnHead;
  }

  drag = false;
  prevScreenX = 0;
  moveGlobal: () => void;
  upGlobal: () => void;

  constructor(
    public el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.sortTableService.registerColumnHead(this.columnId, this);
  }
  ngOnDestroy(): void {
    this.sortTableService.unregisterColumnHead(this.columnId);
  }

  // Set flex basis from service
  setFlexBasisHead(flexBasis: string): void {
    (this.el.nativeElement as HTMLElement).style.flexBasis = flexBasis + '%';
  }

  @HostListener('mousemove', ['$event.layerX'])
  onMouseMove(layerX: number): void {
    if (layerX > (this.el.nativeElement as HTMLElement).offsetWidth - 10) {
      (this.el.nativeElement as HTMLElement).style.cursor = 'ew-resize';
    } else {
      (this.el.nativeElement as HTMLElement).style.cursor = '';
    }
  }
  @HostListener('mousedown', [
    '$event.layerX',
    '$event.screenX',
    '$event.which',
  ])
  onMouseDown(layerX: number, screenX: number, which: number): void {
    if (which === 3) {
      // disable right click drag
      return;
    }
    if (layerX > (this.el.nativeElement as HTMLElement).offsetWidth - 10) {
      this.prevScreenX = screenX;
      this.moveGlobal = this.renderer.listen(
        'window',
        'mousemove',
        (event: MouseEvent) => {
          const deltaX = this.prevScreenX - event.screenX;
          this.prevScreenX = event.screenX;
          // On resize call service
          this.sortTableService.resizeColumnHead(this.columnId, deltaX);
        },
      );
      this.upGlobal = this.renderer.listen('window', 'mouseup', () => {
        this.moveGlobal();
        this.upGlobal();
      });
    }
  }
  getWidth(): number {
    return (this.el.nativeElement as HTMLElement).offsetWidth;
  }
}
