import { ContentChild, ViewContainerRef, HostBinding, AfterContentInit} from '@angular/core';
import { Directive } from '@angular/core';

import { ModalService } from '../modal/modal.service';

@Directive({
  selector: '[ozModalContainer]'
})
export class ModalContainerDirective implements AfterContentInit {
  @ContentChild('modalContainer', { read: ViewContainerRef }) target;

  @HostBinding('class.active')
  active: boolean;

  title: string;

  constructor(public modalService: ModalService) {
    this.modalService.registerContainer(this);
  }

  ngAfterContentInit(): void {
  }

  close() {
    this.modalService.close();
  }

}
