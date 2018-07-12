import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { ModalService } from '../modal.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      declarations: [ ModalComponent ],
      providers: [
        {
          provide: ModalService,
          useClass: class {
            registerModal = () => {};
            close = () => {};
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
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
