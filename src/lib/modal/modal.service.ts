import { Subject, BehaviorSubject } from 'rxjs';

import { Type, Injectable, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ModalContainerDirective } from './modal-container.directive';

export class ModalWindow {
  data: { [index: string]: any; };
  contentRef: ComponentRef<{}>;
  modal: any;
  wait: boolean;
  containerKey: string;

  constructor(component, data, wait, containerKey) {
    this.data = data;
    this.contentRef = component;
    this.wait = wait;
    this.containerKey = containerKey;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  containers: Map<string, ModalContainerDirective>;
  modals: ModalWindow[];
  removeStack: ModalWindow[];
  modalAdded: Subject<ModalWindow>;
  opened: BehaviorSubject<Boolean>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.modals = [];
    this.removeStack = [];
    this.modalAdded = new Subject();
    this.opened = new BehaviorSubject(false);
    this.containers = new Map();
  }
  registerContainer(key: string, container: ModalContainerDirective) {
    this.containers.set(key, container);
  }
  registerModal(modal: any) {
    const lastModal = this.modals[this.modals.length - 1];
    if (!lastModal || lastModal.modal) {
      return;
    }
    lastModal.modal = modal;
    if (!lastModal.wait) {
      setTimeout(() => {
        lastModal.modal.state = 'show';
      });
    }
  }
  // Add new modal and return instance of component
  add(type: Type<{}>, data: { [index: string]: any; } = {}, containerKey: string = 'default'): any {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(type);
    const componentRef = this.containers.get(containerKey).target.createComponent(componentFactory);

    const modal = new ModalWindow(componentRef, data, componentRef.instance['modalWait'], containerKey);
    this.modals.push(modal);
    this.containers.get(containerKey).active = true;

    this.modalAdded.next(modal);

    const componentElement = componentRef.location;

    componentElement.nativeElement.parentElement.appendChild(componentElement.nativeElement);

    Object.keys(data).forEach(key => {
      componentRef.instance[key] = data[key];
    });
    this.opened.next(this.modals.length !== 0);

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
    lastModal.modal.state = 'close';
    setTimeout(() => {
      if (lastModal.contentRef) {
        lastModal.contentRef.destroy();
      }
      this.modals.splice(this.modals.indexOf(lastModal), 1);
      this.opened.next(this.modals.length !== 0);


      this.containers.get(lastModal.containerKey).active = this.modals.length > 0;
    }, 200);
  }
  closeAll() {
    while (this.modals.length > 0) {
      this.close(this.modals[this.modals.length - 1].modal);
    }
  }
}

