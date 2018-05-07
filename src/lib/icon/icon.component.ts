import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  OnInit,
  HostListener,
  HostBinding
} from '@angular/core';

@Component({
  selector: 'oz-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input()
  icon: string;

  // Size small, normal, large, x-large
  @Input()
  size = 'large';

  @Input()
  cursor = 'inherit';

  @Input()
  states: any;

  @Input()
  set state (state: any) {
    this.icon = this.states[state];
  }
}
