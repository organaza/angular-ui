import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'oz-tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
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
      transition('void => show', animate('150ms linear')),
      transition('show => void', animate('150ms linear')),
    ]),
  ],
})
export class TooltipComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) target;

  @Input()
  text: string;

  @Input()
  @HostBinding('class.hide-back')
  hideBack: boolean;

  @HostBinding('@state')
  state: String = 'show';

  @HostBinding('style.left.px')
  x: Number = 0;

  @HostBinding('style.top.px')
  y: Number = 0;

  @HostBinding('style.white-space')
  whitespace: string;

  @HostBinding('style.width')
  width = 'auto';

  @HostBinding('style.max-width')
  maxWidth = '80%';

  @HostBinding('style.text-align')
  textAlign = 'center';

  constructor() {}

  ngOnInit() {}
}
