import { SortTableRowDirective } from './sorttable-row.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableRowDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableRowDirective],
      }).compileComponents();
    }),
  );
});
