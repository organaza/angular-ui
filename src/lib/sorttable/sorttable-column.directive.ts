import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { SortTableService } from './sorttable.service';
import { SortTableDirective } from './sorttable.directive';

@Directive({
  selector: '[ozSortTableColumn]',
})
export class SortTableColumnDirective implements OnInit, OnDestroy {
  @Input('ozSortTableColumn') sortTableColumn: string; // eslint-disable-line  @angular-eslint/no-input-rename

  @Input() depth: number;

  get columnId(): string {
    return this.sortTable.sortTable + ':' + this.sortTableColumn;
  }

  index: number;

  constructor(
    private el: ElementRef,
    private sortTableService: SortTableService,
    private sortTable: SortTableDirective,
  ) {}

  ngOnInit(): void {
    this.sortTableService.registerColumn(this.columnId, this);
  }
  ngOnDestroy(): void {
    this.sortTableService.unregisterColumn(this.columnId, this.index);
  }
  // Set flex basis from service
  setFlexBasis(flexBasis: number): void {
    if (this.depth) {
      (this.el
        .nativeElement as HTMLElement).style.flexBasis = `calc(${flexBasis}% - ${
        this.depth * 10
      }em)`;
    } else {
      (this.el.nativeElement as HTMLElement).style.flexBasis =
        flexBasis.toString() + '%';
    }
  }
}
