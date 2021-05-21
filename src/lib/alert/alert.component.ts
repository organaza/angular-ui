import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { AlertButton, AlertInstance, AlertService } from './alert.service';
import {
  ShortcutService,
  ShortcutObservable,
} from '../shortcut/shortcut.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'oz-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('state', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(0) scale(0.95)',
        }),
      ),
      state(
        'show',
        style({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
        }),
      ),
      transition('void => show', animate('200ms 100ms ease-out')),
      transition('show => void', animate('200ms ease-out')),
    ]),
    trigger('backgroundState', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      state(
        'show',
        style({
          opacity: 1,
        }),
      ),
      transition('void => show', animate('200ms ease-out')),
      transition('show => void', animate('200ms 100ms ease-out')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit, OnDestroy {
  shortcutESC: ShortcutObservable;
  shortcutEnter: ShortcutObservable;

  @Input()
  alert: AlertInstance;

  constructor(
    public alertService: AlertService,
    private shortcutService: ShortcutService,
    private cd: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {
    this.shortcutESC = this.shortcutService.subscribe(
      'Escape',
      false,
      true,
      () => {
        for (let i = 0; i < this.alert.buttons.length; ++i) {
          const button = this.alert.buttons[i];
          if (!button.affirmative) {
            this.alertService.result.next(button);
            this.alertService.result.complete();
            break;
          }
        }
        this.alertService.close();
        this.cd.detectChanges();
      },
    );
    this.shortcutEnter = this.shortcutService.subscribe(
      'Enter',
      false,
      true,
      () => {
        for (let i = 0; i < this.alert.buttons.length; ++i) {
          const button = this.alert.buttons[i];
          if (button.affirmative) {
            this.alertService.result.next(button);
            this.alertService.result.complete();
            this.alertService.close();
            return;
          }
        }
      },
    );
  }
  ngOnDestroy(): void {
    this.alertService = null;
    this.shortcutService = null;
    this.shortcutESC.unsubscribe();
    this.shortcutEnter.unsubscribe();
  }
  onClickAlertButton(button: AlertButton): void {
    this.alertService.result.next(button);
    this.alertService.result.complete();
    this.alertService.close();
  }
  closeAlertByClick(): void {
    if (this.alert.closeByClickBackground) {
      if (this.alert.buttons && this.alert.clickByBackgroundIsNo) {
        for (let i = 0; i < this.alert.buttons.length; ++i) {
          const button = this.alert.buttons[i];
          if (!button.affirmative) {
            this.alertService.result.next(button);
            this.alertService.result.complete();
            break;
          }
        }
      }
      this.alertService.close();
    }
  }
}
