import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
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
  clicked = new EventEmitter<void>();

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
  onKeyDownListener(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!this.disabled) {
        this.onClick();
      }
    }
  }

  @HostListener('mouseleave', ['$event'])
  onmouseleave(): void {
    this.clickCount = 0;
  }

  constructor(private cd: ChangeDetectorRef) {}

  onClickButton(): void {
    if (!this.disabled && !this.inProgress) {
      this.onClick();
    }
  }
  onClick(): void {
    if (this.double) {
      this.clickCount++;
      this.cd.markForCheck();
      if (this.clickCount === 2) {
        this.clicked.next();
      }
    } else {
      if (this.timeout === 0) {
        this.clicked.next();
      } else {
        window.setTimeout(() => {
          this.clicked.next();
        }, this.timeout);
      }
    }
  }
}
