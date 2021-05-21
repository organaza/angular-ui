import { ModalContainerDirective } from './modal-container.directive';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('ModalContainerDirective', () => {
  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [ModalContainerDirective],
      }).compileComponents();
    }),
  );
});
