import { SortTableRowHandlerDirective } from './sorttable-row-handler.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableRowHandlerDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableRowHandlerDirective],
      }).compileComponents();
    }),
  );
});
