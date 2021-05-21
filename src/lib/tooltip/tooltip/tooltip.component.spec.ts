import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TooltipComponent } from './tooltip.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule],
        declarations: [TooltipComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
