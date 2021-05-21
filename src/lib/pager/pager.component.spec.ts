import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PagerComponent } from './pager.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TextinputComponent } from '../textinput/textinput.component';

describe('PagerComponent', () => {
  let component: PagerComponent;
  let fixture: ComponentFixture<PagerComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [PagerComponent, TextinputComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
