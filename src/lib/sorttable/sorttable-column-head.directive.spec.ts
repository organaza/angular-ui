import { SortTableColumnHeadDirective } from './sorttable-column-head.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableColumnHeadDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableColumnHeadDirective],
      }).compileComponents();
    }),
  );
});
