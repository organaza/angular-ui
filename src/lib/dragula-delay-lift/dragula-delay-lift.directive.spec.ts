import { DragulaDelayLiftDirective } from './dragula-delay-lift.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('DragulaDelayLiftDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [DragulaDelayLiftDirective],
      }).compileComponents();
    }),
  );
});
