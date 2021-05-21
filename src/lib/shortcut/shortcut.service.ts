import { Injectable } from '@angular/core';
import { Observer, Observable, Subscriber } from 'rxjs';

export class Sign {
  value: string;
  meta: boolean;
  skipInput: boolean;
  observer: Observer<KeyboardEvent>;
  id: string;
  working: boolean;
}

export class ShortcutObservable {
  id: string;
  observable: Observable<KeyboardEvent>;

  constructor(
    private shortcutService: ShortcutService,
    func: (observer: Subscriber<KeyboardEvent>, id: string) => void,
    callback: (event: KeyboardEvent) => void,
  ) {
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    this.observable = new Observable<KeyboardEvent>((observer) => {
      func(observer, this.id);
    });
    this.observable.subscribe(callback);
  }
  unsubscribe(): void {
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

  constructor() {
    window.addEventListener('keydown', (event) => {
      this.keyDown(event);
    });
    window.addEventListener('keyup', (event) => {
      this.keyUp(event);
    });
  }

  addInArray(item: Sign): void {
    this.arraySignatories.unshift(item);
  }
  subscribe(
    value: string,
    meta: boolean,
    skipInput: boolean,
    callback: (event: KeyboardEvent) => void,
  ): ShortcutObservable {
    return new ShortcutObservable(
      this,
      (observer, id) => {
        this.addInArray({
          value: value,
          meta: meta,
          skipInput: skipInput,
          observer,
          id,
          working: true,
        });
      },
      callback,
    );
  }
  keyDown(event: KeyboardEvent): void {
    this.keyPressed[event.key.toLowerCase()] = true;
    this.keyPressed[event.code.toLowerCase()] = true;
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (
        this.testPress(event, this.arraySignatories[i]) &&
        this.arraySignatories[i].working
      ) {
        event.preventDefault();
        this.arraySignatories[i].observer.next(event);
        break;
      }
    }
  }
  keyUp(key: KeyboardEvent): void {
    this.keyPressed[key.key.toLowerCase()] = undefined;
    this.keyPressed[key.code.toLowerCase()] = undefined;
  }
  testPress(event: KeyboardEvent, sign: Sign): boolean {
    const isMeta = event.ctrlKey || event.altKey || event.metaKey;
    const isInput =
      (<Element>event.target).localName &&
      ((<Element>event.target).localName === 'input' ||
        (<Element>event.target).localName === 'textarea');
    if (isInput) {
      return (
        (event.key.toLowerCase() === sign.value.toLowerCase() ||
          event.code.toLowerCase() === sign.value.toLowerCase()) &&
        sign.meta === isMeta &&
        sign.skipInput
      );
    }
    return (
      (event.key.toLowerCase() === sign.value.toLowerCase() ||
        event.code.toLowerCase() === sign.value.toLowerCase()) &&
      sign.meta === isMeta
    );
  }
  pause(value: string): void {
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].value === value) {
        this.arraySignatories[i].working = false;
      }
    }
  }
  continue(value: string): void {
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].value === value) {
        this.arraySignatories[i].working = true;
      }
    }
  }
}
