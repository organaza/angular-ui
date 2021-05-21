import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ShortcutService } from '../../shortcut/shortcut.service';
import { ModalService } from '../modal.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ShortcutServiceStub } from 'projects/oz/src/test/shortcut-service-stub';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(
    waitForAsync(() => {
      return TestBed.configureTestingModule({
        imports: [BrowserAnimationsModule],
        declarations: [ModalComponent],
        providers: [
          {
            provide: ModalService,
            useClass: class {
              registerModal = () => {
                return;
              };
              close = () => {
                return;
              };
            },
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
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
