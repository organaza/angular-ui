import { Subject, BehaviorSubject } from 'rxjs';

import {
  Type,
  Injectable,
  ComponentFactoryResolver,
  ComponentRef,
} from '@angular/core';
import { ModalContainerDirective } from './modal-container.directive';
import { ModalComponent } from './modal/modal.component';

export class ModalWindow {
  data: Record<string, unknown>;
  contentRef: ComponentRef<unknown>;
  modal: ModalComponent;
  wait: boolean;
  containerKey: string;

  constructor(
    component: ComponentRef<unknown>,
    data: Record<string, unknown>,
    wait: boolean,
    containerKey: string,
  ) {
    this.contentRef = component;
    this.data = data;
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
  opened: BehaviorSubject<boolean>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.modals = [];
    this.removeStack = [];
    this.modalAdded = new Subject();
    this.opened = new BehaviorSubject(false);
    this.containers = new Map<string, ModalContainerDirective>();
  }
  registerContainer(key: string, container: ModalContainerDirective): void {
    this.containers.set(key, container);
  }
  registerModal(modal: ModalComponent): void {
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
  add<T>(
    type: Type<T>,
    data: Record<string, unknown> = {},
    containerKey: string = 'default',
  ): T {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      type,
    );
    const componentRef = this.containers
      .get(containerKey)
      .target.createComponent(componentFactory);

    const modal = new ModalWindow(
      componentRef,
      data,
      componentRef.instance['modalWait'],
      containerKey,
    );
    this.modals.push(modal);
    this.containers.get(containerKey).active = true;

    this.modalAdded.next(modal);

    const componentElement = componentRef.location;

    (componentElement.nativeElement as HTMLElement).parentElement.appendChild(
      componentElement.nativeElement,
    );

    Object.keys(data).forEach((key) => {
      componentRef.instance[key] = data[key];
    });
    this.opened.next(this.modals.length !== 0);

    return componentRef.instance;
  }
  show(): void {
    const lastModal = this.modals[this.modals.length - 1];
    if (!lastModal) {
      return;
    }
    lastModal.modal.state = 'show';
  }
  close(modal?: ModalComponent): void {
    let lastModal: ModalWindow;
    if (modal) {
      lastModal = this.modals.find((m) => m.modal === modal);
    } else {
      lastModal = this.modals[this.modals.length - 1];
    }
    if (!lastModal) {
      return;
    }
    lastModal.modal.state = 'close';
    window.setTimeout(() => {
      if (lastModal.contentRef) {
        lastModal.contentRef.destroy();
      }
      this.modals.splice(this.modals.indexOf(lastModal), 1);
      this.opened.next(this.modals.length !== 0);

      this.containers.get(lastModal.containerKey).active =
        this.modals.length > 0;
    }, 200);
  }
  closeAll(): void {
    while (this.modals.length > 0) {
      this.close(this.modals[this.modals.length - 1].modal);
    }
  }
}
