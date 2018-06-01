import { ContentChild, ViewContainerRef, HostBinding, AfterContentInit, Input, OnInit} from '@angular/core';
import { Directive } from '@angular/core';

import { ModalService } from '../modal/modal.service';

@Directive({
  selector: '[ozModalContainer]'
})
export class ModalContainerDirective implements OnInit {
  @ContentChild('modalContainer', { read: ViewContainerRef }) target;

  @HostBinding('class.active')
  active: boolean;

  title: string;

  @Input()
  ozModalContainer: string;

  constructor(public modalService: ModalService) {

  }

  ngOnInit(): void {
    this.modalService.registerContainer(this.ozModalContainer || 'default', this);
  }

  close() {
    this.modalService.close();
  }

}
