import { PreventParentScrollDirective } from './prevent-parent-scroll.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('PreventParentScrollDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [PreventParentScrollDirective],
      }).compileComponents();
    }),
  );
});
