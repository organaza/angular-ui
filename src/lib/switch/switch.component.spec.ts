import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';
import { FormsModule } from '@angular/forms';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [SwitchComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
