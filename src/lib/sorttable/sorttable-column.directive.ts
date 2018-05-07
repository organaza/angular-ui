import { Directive, Input, Output, ElementRef, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SortTableService } from '../sorttable/sorttable.service';
import { SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableColumn]'
})
export class SortTableColumnDirective implements OnInit, OnDestroy {

  @Input() sortTableColumn: string;

  @Input() depth: number;

  get columnId(): string {
    return this.sortTable.sortTable + ':' + this.sortTableColumn;
  }

  private el: HTMLElement;
  index: number;

  constructor(el: ElementRef, private sortTableService: SortTableService, private sortTable: SortTableDirective) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.sortTableService.registerColumn(this.columnId, this);
  }
  ngOnDestroy() {
    this.sortTableService.unregisterColumn(this.columnId, this.index);
  }
  // Set flex basis from service
  setFlexBasis(flexBasis: number) {
    if (this.depth) {
      this.el.style.flexBasis = `calc(${flexBasis}% - ${this.depth * 10}em)`;
    } else {
      this.el.style.flexBasis = flexBasis + '%';
    }
  }
}
