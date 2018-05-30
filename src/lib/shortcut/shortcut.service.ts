import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';

export class Sign  {
  value: string;
  observer: Observer<{}>;
  id: string;
  working: boolean;
}

export class ShortcutObservable<T> {
  id: string;
  observable: any;

  constructor(private shortcutService: ShortcutService, func: any, callback: any) {
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    this.observable = new Observable<T>((observer) => {
      func(observer, this.id);
    });
    this.observable.subscribe(callback);
  }
  unsubscribe() {
    for (let i = 0; i < this.shortcutService.arraySignatories.length; ++i) {
      if (this.shortcutService.arraySignatories[i].id === this.id) {
        this.shortcutService.arraySignatories.splice(i, 1);
        break;
      }
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {
  arraySignatories: Sign[] = [];
  keyPressed = {};

  constructor(

  ) {
    window.addEventListener('keydown', (event) => {
      this.keyDown(event);
    });
    window.addEventListener('keyup', (event) => {
      this.keyUp(event);
    });
  }

  addInArray(item: Sign) {
    this.arraySignatories.unshift(item);
  }
  subscribe(value: string, callback: any): ShortcutObservable<any> {
    return new ShortcutObservable<any>(this, (observer, id) => {
      this.addInArray({value: value, observer, id, working: true});
    }, callback);
  }
  keyDown(event: any) {
    if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    if (event.target.localName === 'input' || event.target.localName === 'textarea') {
      return;
    }
    this.keyPressed[event.key.toLowerCase()] = true;
    this.keyPressed[event.code.toLowerCase()] = true;
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.testPress(event, this.arraySignatories[i]) && this.arraySignatories[i].working) {
        event.preventDefault();
        this.arraySignatories[i].observer.next(event);
        break;
      }
    }
  }
  keyUp(key: KeyboardEvent) {
    this.keyPressed[key.key.toLowerCase()] = undefined;
    this.keyPressed[key.code.toLowerCase()] = undefined;
  }
  testPress(event: KeyboardEvent, sign: Sign): boolean {
    return event.key.toLowerCase() === sign.value.toLowerCase() || event.code.toLowerCase() === sign.value.toLowerCase();
  }
  pause(value: string) {
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].value === value) {
        this.arraySignatories[i].working = false;
      }
    }
  }
  continue(value: string) {
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].value === value) {
        this.arraySignatories[i].working = true;
      }
    }
  }
}
