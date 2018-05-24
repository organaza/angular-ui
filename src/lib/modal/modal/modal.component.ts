import {
  EventEmitter,
  Output,
  Component,
  Directive,
  OnInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { ModalService } from '../../modal/modal.service';
import { ShortcutService, ShortcutObservable } from '../../shortcut/shortcut.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'oz-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('state', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(0) scale(0.95)',
      })),
      state('create', style({
        opacity: 0,
        transform: 'translateY(0) scale(0.95)',
      })),
      state('show', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      })),
      state('close', style({
        opacity: 0,
        transform: 'translateY(0) scale(0.95)',
      })),
      transition('void => create', animate('0ms')),
      transition('void => show', animate('200ms 100ms ease-out')),
      transition('create => show', animate('200ms 100ms ease-out')),
      transition('show => close', animate('200ms ease-out')),
    ]),
    trigger('backgroundState', [
      state('void', style({
        opacity: 0,
      })),
      state('create', style({
        opacity: 1,
      })),
      state('show', style({
        opacity: 1,
      })),
      state('close', style({
        opacity: 0,
      })),
      transition('void => create', animate('200ms ease-out')),
      transition('void => show', animate('200ms ease-out')),
      transition('create => show', animate('0ms ease-out')),
      transition('show => close', animate('200ms 100ms ease-out')),
    ])
  ]
})

export class ModalComponent implements OnInit, OnDestroy {
  set state(value: string) {
    this.__state = value;
    this.cd.detectChanges();
  }
  get state() {
    return this.__state;
  }
  __state = 'create';
  shortcut: ShortcutObservable<any>;

  @Output()
  closed: EventEmitter<{}> = new EventEmitter();

  constructor(
    public modalService: ModalService,
    private shortcutService: ShortcutService,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) {
    this.shortcut = this.shortcutService.subscribe('Escape', () => {
      this.close();
    });
  }

  ngOnInit() {
    this.modalService.registerModal(this);
  }

  ngOnDestroy() {
    this.shortcut.unsubscribe();
    this.closed.complete();
  }

  close() {
    this.modalService.close(this);
    this.state = 'close';
    this.cd.detectChanges();
    window.setTimeout(() => {
      this.closed.next(true);
    }, 200);

  }

  onButtonClick(button: any) {
  }
}

@Directive({
  selector: '[ozModalHeader]'
})

export class ModalHeaderDirective {
  constructor() {
  }
}

@Directive({
  selector: '[ozModalSubHeader]'
})

export class ModalSubHeaderDirective {
  constructor() {
  }
}

@Directive({
  selector: '[ozModalHeaderButtons]'
})

export class ModalHeaderButtonsDirective {
  constructor() {
  }
}

@Directive({
  selector: '[ozModalClose]'
})

export class ModalCloseDirective {
  constructor() {
  }
}

@Directive({
  selector: '[ozModalBody]'
})

export class ModalBodyDirective {
  constructor() {
  }
}

@Directive({
  selector: '[ozModalFooter]'
})

export class ModalFooterDirective {
  constructor() {
  }
}
