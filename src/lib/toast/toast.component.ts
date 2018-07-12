import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'oz-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})

export class ToastComponent implements OnInit {
  constructor(
    public toastService: ToastService) {
  }

  ngOnInit() {
  }
  clickToast(toast: any) {
    if (toast.object.onClick) {
      toast.object.onClick();
    }
    this.toastService.close(toast);
  }
  closeToast(toast: any, eventMouser: MouseEvent) {
    eventMouser.stopImmediatePropagation();
    this.toastService.close(toast);
  }
}
