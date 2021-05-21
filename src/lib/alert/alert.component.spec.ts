import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ShortcutServiceStub } from '../../test/shortcut-service-stub';
import { ShortcutService } from '../shortcut/shortcut.service';
import { AlertComponent } from './alert.component';
import { AlertInstance, AlertService } from './alert.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [FormsModule, NoopAnimationsModule],
        declarations: [AlertComponent],
        providers: [
          {
            provide: AlertService,
            useClass: class {},
          },
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
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    component.alert = {} as AlertInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
