import {
  ContentChild,
  Directive,
  HostBinding,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ModalService } from './modal.service';

@Directive({
  selector: '[ozModalContainer]',
})
export class ModalContainerDirective implements OnInit {
  @ContentChild('modalContainer', { read: ViewContainerRef, static: true })
  target: ViewContainerRef;

  @HostBinding('class.active')
  active: boolean;

  title: string;

  @Input()
  ozModalContainer: string;

  constructor(public modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.registerContainer(
      this.ozModalContainer || 'default',
      this,
    );
  }

  close(): void {
    this.modalService.close();
  }
}
