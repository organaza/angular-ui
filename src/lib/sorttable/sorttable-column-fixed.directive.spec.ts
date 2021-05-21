import { SortTableColumnFixedDirective } from './sorttable-column-fixed.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableColumnFixedDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableColumnFixedDirective],
      }).compileComponents();
    }),
  );
});
