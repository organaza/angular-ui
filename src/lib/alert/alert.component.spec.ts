import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { TextinputComponent } from '../textinput/textinput.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from './alert.service';
import { Subject } from 'rxjs';
import { ShortcutService } from '../shortcut/shortcut.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
      ],
      declarations: [
        AlertComponent
      ],
      providers: [
        {
          provide: AlertService,
          useClass: class {
            currentObserver: Subject<any> = new Subject();
          }
        },
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
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    component.alert = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
