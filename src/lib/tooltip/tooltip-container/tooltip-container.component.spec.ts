import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TooltipContainerComponent } from './tooltip-container.component';
import { TooltipService } from '../tooltip.service';

describe('TooltipContainerComponent', () => {
  let component: TooltipContainerComponent;
  let fixture: ComponentFixture<TooltipContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [TooltipContainerComponent],
        providers: [
          {
            provide: TooltipService,
            useClass: class {
              registerContainer = () => {
                return;
              };
            },
          },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
