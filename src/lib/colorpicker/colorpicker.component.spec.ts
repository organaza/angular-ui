import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColorPickerComponent } from './colorpicker.component';
import { DropDownComponent } from '../dropdown/dropdown.component';
import { TextinputComponent } from '../textinput/textinput.component';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

describe('ColorpickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
          ColorPickerComponent,
          DropDownComponent,
          TextinputComponent,
          IconComponent,
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
