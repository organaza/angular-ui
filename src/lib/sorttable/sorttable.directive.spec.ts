import { SortTableDirective } from './sorttable.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('SortTableDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [SortTableDirective],
      }).compileComponents();
    }),
  );
});
