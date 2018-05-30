import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  current: any;
  result: Subject<any>;
  width = 310;
  // alert, prompt, confirm
  constructor() {
    this.result = new Subject();
  }
  alert(title: string, text: string): Observable<any> {
    this.current = {
      type: 'alert',
      title: title,
      text: text,
      state: 'show'
    };
    this.current.buttons = [
      {
        label: 'OK',
        affirmative: true,
        class: 'common-button'
      }
    ];
    this.result = new Subject();
    return this.result;
  }
  prompt(title: string, text: string, defaultValue = ''): Observable<any> {
    this.current = {
      type: 'prompt',
      title: title,
      text: text,
      defaultValue: defaultValue,
      state: 'show'
    };
    this.current.buttons = [
      {
        label: 'CANCEL',
        affirmative: false
      },
      {
        label: 'OK',
        affirmative: true
      }
    ];
    this.result = new Subject();
    return this.result;
  }
  confirm(
    title: string,
    text: string,
    isAttention = false,
    labelYES = 'Yes',
    labelNO = 'No',
    closeByClickBackground = true,
    clickByBackgroundIsNo = false,
    width = null
  ) {
    this.current = {
      type: 'confirm',
      title: title,
      text: text,
      state: 'show',
      closeByClickBackground: closeByClickBackground,
      clickByBackgroundIsNo: clickByBackgroundIsNo,
      isAttention: isAttention,
      width: width
    };
    this.current.buttons = [
      {
        label: labelYES,
        affirmative: true,
        isAttention: isAttention
      },
      {
        label: labelNO,
        affirmative: false
      }
    ];
    this.result = new Subject();
    return this.result;
  }
  close() {
    if (this.current) {
      this.current.state = 'void';
      // HACK: Used simple timeout for brevity
      setTimeout(() => {
        this.current = null;
      }, 200);
    }
  }
}
