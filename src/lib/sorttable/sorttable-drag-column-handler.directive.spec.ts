import { SortTableDragColumnHandlerDirective } from './sorttable-drag-column-handler.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableDragColumnHandlerDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableDragColumnHandlerDirective],
      }).compileComponents();
    }),
  );
});
