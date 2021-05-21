import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { SortTableService } from './sorttable.service';

@Directive({
  selector: '[ozSortTableColumnFixed]',
})
export class SortTableColumnFixedDirective implements OnInit {
  @Input('ozSortTableColumnFixed') sortTableColumnFixed: string; // eslint-disable-line  @angular-eslint/no-input-rename

  @HostBinding('style.flex')
  flex: string;

  index: number;

  constructor(private sortTableService: SortTableService) {}

  ngOnInit(): void {
    this.flex = this.sortTableService.getFlex(
      'fixed:' + this.sortTableColumnFixed,
    );
  }
}
