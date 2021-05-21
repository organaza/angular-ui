import { TooltipDirective } from './tooltip.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('TooltipDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [TooltipDirective],
      }).compileComponents();
    }),
  );
});
