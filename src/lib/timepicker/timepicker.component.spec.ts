import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerComponent } from './timepicker.component';
import { TextinputComponent } from '../textinput/textinput.component';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { ShortcutService } from '../shortcut/shortcut.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePickerComponent ],
      imports: [FormsModule],
      providers: [
        {
          provide: ShortcutService,
          useClass: class {
            subscribe(sign: string, key: string, callback: any): any {
              return {
                unsubscribe: () => {

                }
              };
            }
          }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
