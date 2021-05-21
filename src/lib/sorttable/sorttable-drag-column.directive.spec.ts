import { SortTableDragColumnDirective } from './sorttable-drag-column.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableDragColumnDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableDragColumnDirective],
      }).compileComponents();
    }),
  );
});
