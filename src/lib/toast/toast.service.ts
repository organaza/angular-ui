import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: ToastInstance[] = [];
  error(
    text: string,
    timeout = 3000,
    persistant = true,
    handler: () => void = null,
    object: Record<string, unknown> = null,
  ): void {
    this.add('error', text, timeout, persistant, handler, object);
  }
  clear(text: string): void {
    for (const toast of this.toasts) {
      if (toast.text === text) {
        const index = this.toasts.indexOf(toast);
        this.toasts.splice(index, 1);
      }
    }
  }
  warn(
    text: string,
    timeout = 3000,
    persistant = true,
    handler: () => void = null,
    object: Record<string, unknown> = null,
  ): void {
    this.add('warn', text, timeout, persistant, handler, object);
  }
  info(
    text: string,
    timeout = 3000,
    persistant = false,
    handler: () => void = null,
    object: Record<string, unknown> = null,
  ): void {
    this.add('info', text, timeout, persistant, handler, object);
  }
  success(
    text: string,
    timeout = 3000,
    persistant = false,
    handler: () => void = null,
    object: Record<string, unknown> = null,
  ): void {
    this.add('success', text, timeout, persistant, handler, object);
  }
  add(
    level: string,
    text: string,
    timeout: number,
    persistant: boolean,
    handler: () => void,
    object: Record<string, unknown>,
  ): void {
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
      object: object || {},
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
  close(toast: ToastInstance): void {
    toast.hide = true;
    window.setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      this.toasts.splice(index, 1);
    }, 500);
  }
}

export class ToastInstance {
  level: string;
  text: string;
  hide: boolean;
  timeout: number;
  persistant: boolean;
  object: Record<string, unknown> & { onClick?: () => void };
}
