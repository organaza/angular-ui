import { HostBinding, Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';

@Directive({
  selector: '[ozSortTableColumnFixed]'
})
export class SortTableColumnFixedDirective implements OnInit, OnDestroy {

  @Input() sortTableColumnFixed: string;

  @HostBinding('style.flex')
  flex: string;

  private el: HTMLElement;
  index: number;

  constructor(
    el: ElementRef,
    private sortTableService: SortTableService,
  ) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.flex = this.sortTableService.getWidth('fixed:' + this.sortTableColumnFixed);
  }
  ngOnDestroy() {
  }
}
