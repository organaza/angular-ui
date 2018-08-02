import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  HostListener,
  HostBinding,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'oz-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  clickCount = 0;

  @Input()
  @HostBinding()
  tabindex = 0;

  @Output()
  clicked: EventEmitter<{}> = new EventEmitter();

  @Input()
  text: string;

  @Input()
  disabled: boolean;

  @Input()
  typeButton = 'primary';

  @Input()
  iconClass: string;

  @Input()
  iconSize = 'large';

  @Input()
  selected: boolean;

  @Input()
  double: boolean;

  @Input()
  color: string;

  @Input()
  backgroundColor: string;

  @Input()
  borderColor: string;

  @Input()
  padding: string;

  @Input()
  timeout = 50;

  @Input()
  inProgress: boolean;

  @Input()
  isAttention: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDownListener(event: any) {
    if (event.code === 'Enter') {
      event.preventDefault();
      if (!this.disabled) {
        this.onClick();
      }
      return false;
    }
  }

  @HostListener('mouseleave', ['$event'])
  onmouseleave(event: any) {
    this.clickCount = 0;
  }

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  onClickButton() {
    if (!this.disabled && !this.inProgress) {
      this.onClick();
    }
  }
  onClick() {
    if (this.double) {
      this.clickCount ++;
      this.cd.markForCheck();
      if (this.clickCount === 2) {
        this.clicked.next();
      }
    } else {
      if (this.timeout === 0) {
        this.clicked.next();
      } else {
        setTimeout(() => {
          this.clicked.next();
        }, this.timeout);
      }
    }
  }
}
