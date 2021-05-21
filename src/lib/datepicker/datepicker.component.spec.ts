import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatePickerComponent } from './datepicker.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { OzSettingsService } from '../settings/settings.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        declarations: [
          DatePickerComponent,
          DropDownComponent,
          ButtonComponent,
          IconComponent,
          CalendarComponent,
        ],
        imports: [FormsModule],
        providers: [OzSettingsService],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
