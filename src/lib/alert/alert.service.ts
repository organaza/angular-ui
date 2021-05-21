import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  current: AlertInstance;
  result: Subject<AlertButton>;
  width = 310;
  // alert, prompt, confirm
  constructor() {
    this.result = new Subject();
  }
  alert(title: string, text: string): Observable<AlertButton> {
    this.current = {
      type: 'alert',
      title: title,
      text: text,
      state: 'show',
    };
    this.current.buttons = [
      {
        label: 'OK',
        affirmative: true,
        class: 'common-button',
      },
    ];
    this.result = new Subject();
    return this.result;
  }
  prompt(
    title: string,
    text: string,
    defaultValue: string = '',
  ): Observable<AlertButton> {
    this.current = {
      type: 'prompt',
      title: title,
      text: text,
      defaultValue: defaultValue,
      state: 'show',
    };
    this.current.buttons = [
      {
        label: 'CANCEL',
        affirmative: false,
      },
      {
        label: 'OK',
        affirmative: true,
      },
    ];
    this.result = new Subject();
    return this.result;
  }
  confirm(
    title: string,
    text: string,
    isAttention: boolean = false,
    labelYES: string = 'Yes',
    labelNO: string = 'No',
    closeByClickBackground: boolean = true,
    clickByBackgroundIsNo: boolean = false,
    width: number = null,
  ): Observable<AlertButton> {
    this.current = {
      type: 'confirm',
      title: title,
      text: text,
      state: 'show',
      closeByClickBackground: closeByClickBackground,
      clickByBackgroundIsNo: clickByBackgroundIsNo,
      isAttention: isAttention,
      width: width,
    };
    this.current.buttons = [
      {
        label: labelYES,
        affirmative: true,
        isAttention: isAttention,
      },
      {
        label: labelNO,
        affirmative: false,
      },
    ];
    this.result = new Subject();
    return this.result;
  }
  close(): void {
    if (this.current) {
      this.current.state = 'void';
      // HACK: Used simple timeout for brevity
      window.setTimeout(() => {
        this.current = null;
      }, 200);
    }
  }
}
export interface AlertButton {
  label: string;
  affirmative?: boolean;
  isAttention?: boolean;
  class?: string;
}
export interface AlertInstance {
  type: 'alert' | 'prompt' | 'confirm';
  buttons?: Array<AlertButton>;
  title: string;
  text: string;
  state: 'show' | 'void';
  closeByClickBackground?: boolean;
  clickByBackgroundIsNo?: boolean;
  isAttention?: boolean;
  defaultValue?: string;
  width?: number;
}
