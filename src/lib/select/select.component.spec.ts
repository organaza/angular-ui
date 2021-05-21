import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OzModule } from 'oz';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [OzModule, RouterTestingModule],
        declarations: [SelectComponent],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
