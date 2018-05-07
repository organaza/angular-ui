import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {
  toasts: any[] = [];
  error(text: string, timeout = 3000, persistant = true, handler: any = null, object: any = null) {
    this.add('error', text, timeout, persistant, handler, object);
  }
  clear(text: string) {
    for (const toast of this.toasts) {
      if (toast.text === text) {
        const index = this.toasts.indexOf(toast);
        this.toasts.splice(index, 1);
      }
    }
  }
  warn(text: string, timeout = 3000, persistant = true, handler: any = null, object: any = null) {
    this.add('warn', text, timeout, persistant, handler, object);
  }
  info(text: string, timeout = 3000, persistant = false, handler: any = null, object: any = null) {
    this.add('info', text, timeout, persistant, handler, object);
  }
  success(text: string, timeout = 3000, persistant = false, handler: any = null, object: any = null) {
    this.add('success', text, timeout, persistant, handler, object);
  }
  add(level: string, text: string, timeout: number, persistant: boolean, handler: any, object: any) {
    for (let i = 0; i < this.toasts.length; ++i) {
      if (this.toasts[i].text === text) {
        return;
      }
    }
    if (handler) {
      handler();
    }
    const toast = {
      level: level,
      text: text,
      hide: true,
      timeout: timeout,
      persistant: persistant,
      object: object || {}
    };
    this.toasts.push(toast);
    if (!persistant) {
      window.setTimeout(() => {
        this.close(toast);
      }, timeout);
    }
    window.setTimeout(() => {
      toast.hide = false;
    }, 100);
  }
  close(toast: any) {
    toast.hide = true;
    window.setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      this.toasts.splice(index, 1);
    }, 500);
  }
}
