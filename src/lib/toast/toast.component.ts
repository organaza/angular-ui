import { Component } from '@angular/core';
import { ToastInstance, ToastService } from './toast.service';

@Component({
  selector: 'oz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  clickToast(toast: ToastInstance): void {
    if (toast.object.onClick) {
      toast.object.onClick();
    }
    this.toastService.close(toast);
  }
  closeToast(toast: ToastInstance, eventMouser: MouseEvent): void {
    eventMouser.stopImmediatePropagation();
    this.toastService.close(toast);
  }
}
