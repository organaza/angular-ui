import { SortTableColumnDirective } from './sorttable-column.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableColumnDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableColumnDirective],
      }).compileComponents();
    }),
  );
});
