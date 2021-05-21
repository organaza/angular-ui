import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimePickerComponent } from './timepicker.component';
import { ShortcutService } from '../shortcut/shortcut.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShortcutServiceStub } from '../../test/shortcut-service-stub';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [TimePickerComponent],
        imports: [FormsModule],
        providers: [
          {
            provide: ShortcutService,
            useClass: ShortcutServiceStub,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
