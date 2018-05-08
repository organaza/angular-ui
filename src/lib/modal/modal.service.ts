import { Subject } from 'rxjs';

import { Type, Injectable, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ModalContainerDirective } from './modal-container.directive';

export class ModalWindow {
  data: { [index: string]: any; };
  contentRef: ComponentRef<{}>;
  modal: any;
  wait: boolean;

  constructor(component, data, wait) {
    this.data = data;
    this.contentRef = component;
    this.wait = wait;
  }
}

@Injectable()
export class ModalService {
  container: ModalContainerDirective;
  modals: ModalWindow[];
  removeStack: ModalWindow[];
  modalAdded: Subject<ModalWindow>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.modals = [];
    this.removeStack = [];
    this.modalAdded = new Subject();
  }
  registerContainer(container: ModalContainerDirective) {
    this.container = container;
  }
  registerModal(modal: any) {
    const lastModal = this.modals[this.modals.length - 1];
    if (!lastModal || lastModal.modal) {
      return;
    }
    lastModal.modal = modal;
    if (!lastModal.wait) {
      window.setTimeout(() => {
        lastModal.modal.state = 'show';
      });
    }
  }
  // Add new modal and return instance of component
  add(type: Type<{}>, data: { [index: string]: any; } = {}): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(type);
    const componentRef = this.container.target.createComponent(componentFactory);

    const modal = new ModalWindow(componentRef, data, componentRef.instance['modalWait']);
    this.modals.push(modal);
    this.container.active = true;

    this.modalAdded.next(modal);

    const componentElement = componentRef.location;

    componentElement.nativeElement.parentElement.appendChild(componentElement.nativeElement);

    Object.keys(data).forEach(key => {
      componentRef.instance[key] = data[key];
    });

    return componentRef.instance;
  }
  show() {
    const lastModal = this.modals[this.modals.length - 1];
    if (!lastModal) {
      return;
    }
    lastModal.modal.state = 'show';
  }
  close(modal?: any) {
    let lastModal: ModalWindow;
    if (modal) {
      lastModal = this.modals.find(m => m.modal === modal);
    } else {
      lastModal = this.modals[this.modals.length - 1];
    }
    if (!lastModal) {
      return;
    }
    window.setTimeout(() => {
      if (lastModal.contentRef) {
        lastModal.contentRef.destroy();
      }
      this.modals.splice(this.modals.indexOf(lastModal), 1);

      this.container.active = this.modals.length > 0;
    }, 200);
  }
  closeAll() {
    while (this.modals.length > 0) {
      this.close(this.modals[this.modals.length - 1].modal);
    }
  }
}

