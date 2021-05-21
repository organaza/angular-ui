import {
  EventEmitter,
  Output,
  Component,
  Directive,
  OnInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ModalService } from '../modal.service';
import {
  ShortcutService,
  ShortcutObservable,
} from '../../shortcut/shortcut.service';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'oz-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
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
        'create',
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
      state(
        'close',
        style({
          opacity: 0,
          transform: 'translateY(0) scale(0.95)',
        }),
      ),
      transition('void => create', animate('0ms')),
      transition('void => show', animate('150ms 75ms ease-out')),
      transition('create => show', animate('150ms 75ms ease-out')),
      transition('show => close', animate('150ms ease-out')),
    ]),
    trigger('backgroundState', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      state(
        'create',
        style({
          opacity: 1,
        }),
      ),
      state(
        'show',
        style({
          opacity: 1,
        }),
      ),
      state(
        'close',
        style({
          opacity: 0,
        }),
      ),
      transition('void => create', animate('150ms ease-out')),
      transition('void => show', animate('150ms ease-out')),
      transition('create => show', animate('0ms')),
      transition('show => close', animate('150ms 75ms ease-out')),
    ]),
  ],
})
export class ModalComponent implements OnInit, OnDestroy {
  set state(value: string) {
    this.__state = value;
    this.cd.detectChanges();
  }
  get state(): string {
    return this.__state;
  }
  __state = 'create';
  shortcut: ShortcutObservable;

  @Output()
  closed = new EventEmitter<boolean>();

  constructor(
    public modalService: ModalService,
    private shortcutService: ShortcutService,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) {
    this.shortcut = this.shortcutService.subscribe(
      'Escape',
      false,
      true,
      () => {
        this.close();
      },
    );
  }

  ngOnInit(): void {
    this.modalService.registerModal(this);
  }

  ngOnDestroy(): void {
    this.shortcut.unsubscribe();
    this.closed.complete();
  }

  close(): void {
    this.modalService.close(this);
    this.state = 'close';
    this.cd.detectChanges();
    window.setTimeout(() => {
      this.closed.next(true);
    }, 200);
  }
}

@Directive({
  selector: '[ozModalHeader]',
})
export class ModalHeaderDirective {}

@Directive({
  selector: '[ozModalSubHeader]',
})
export class ModalSubHeaderDirective {}

@Directive({
  selector: '[ozModalHeaderButtons]',
})
export class ModalHeaderButtonsDirective {}

@Directive({
  selector: '[ozModalClose]',
})
export class ModalCloseDirective {}

@Directive({
  selector: '[ozModalBody]',
})
export class ModalBodyDirective {}

@Directive({
  selector: '[ozModalFooter]',
})
export class ModalFooterDirective {}
