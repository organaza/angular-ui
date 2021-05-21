import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'oz-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  @Input()
  icon: string;

  // Size small, normal, large, x-large
  @Input()
  size = 'large';

  @Input()
  cursor = 'inherit';

  @Input()
  states: Record<string | number, string>;

  @Input()
  state: string | number;
  @Input()
  boolState: boolean;

  ngOnChanges(): void {
    let key = this.state;
    if (this.boolState !== undefined) {
      key = this.boolState ? 'true' : 'false';
    }
    this.icon = this.states?.[key] || this.icon;
  }
}
