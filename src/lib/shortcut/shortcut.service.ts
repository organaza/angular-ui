import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

export class Sign  {
  sign: string;
  keyCode: number;
  observer: Observer<{}>;
  id: string;
  working: boolean;
}

export class ShortcutObservable {
  id: string;
  observable: any;

  constructor(private shortcutService: ShortcutService, func: any, callback: any) {
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    this.observable = new Observable((observer) => {
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

@Injectable()
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

  getKeyCode(key: string): number {
    if (!key) {
      return null;
    }
    key = key.toLowerCase();
    switch (key) {
      case 'a' || 'ф':
        return 65;
      case 'b' || 'и':
        return 66;
      case 'c' || 'с':
        return 67;
      case 'd' || 'в':
        return 68;
      case 'e' || 'у':
        return 69;
      case 'f' || 'а':
        return 70;
      case 'g' || 'п':
        return 71;
      case 'h' || 'р':
        return 72;
      case 'i' || 'ш':
        return 73;
      case 'j' || 'о':
        return 74;
      case 'k' || 'л':
        return 75;
      case 'l' || 'д':
        return 76;
      case 'm' || 'ь':
        return 77;
      case 'n' || 'т':
        return 78;
      case 'o' || 'щ':
        return 79;
      case 'p' || 'з':
        return 80;
      case 'q' || 'й':
        return 81;
      case 'r' || 'к':
        return 82;
      case 's' || 'ы':
        return 83;
      case 't' || 'е':
        return 84;
      case 'u' || 'г':
        return 85;
      case 'v' || 'м':
        return 86;
      case 'w' || 'ц':
        return 87;
      case 'x' || 'ч':
        return 88;
      case 'y' || 'н':
        return 89;
      case 'z' || 'я':
        return 90;
    }
  }

  addInArray(item: Sign) {
    this.arraySignatories.unshift(item);
  }
  subscribe(sign: string, key: string, callback: any): ShortcutObservable {
    return new ShortcutObservable(this, (observer, id) => {
      this.addInArray({sign: this.translateSign(sign), keyCode: this.getKeyCode(key), observer, id, working: true});
    }, callback);
  }
  keyDown(key: any) {
    if (key.target.localName === 'input' || key.target.localName === 'textarea') {
      return;
    }
    if (key.keyCode < 48 || key.keyCode > 90) {
      if (!key.key && !key.code) {
        return;
      }
      this.keyPressed[(key.key || key.code).toLowerCase()] = true;
    } else {
      this.keyPressed[key.keyCode] = true;
    }
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      const buttonPressed =
        !this.arraySignatories[i].keyCode ||
        this.arraySignatories[i].keyCode &&
        this.keyPressed[this.arraySignatories[i].keyCode];

      const signPressed =
        !this.arraySignatories[i].sign ||
        this.arraySignatories[i].sign &&
        this.testSignPress(this.arraySignatories[i].sign);

      if (buttonPressed && signPressed && this.arraySignatories[i].working) {
        key.preventDefault();
        this.arraySignatories[i].observer.next(true);
        break;
      }
    }
  }
  keyUp(event: KeyboardEvent) {
    const code = event.key.charCodeAt(0);
    if (code < 48 || code > 90) {
      this.keyPressed[event.key.toLowerCase()] = null;
    } else {
      this.keyPressed[code] = null;
    }
  }
  testSignPress(sign: string): boolean {
    if (!sign) {
      return true;
    }
    if (sign === 'control') {
      return this.keyPressed[sign] || this.keyPressed['meta'];
    }
    return this.keyPressed[sign];
  }
  translateSign(sign: string): string {
    if (!sign) {
      return null;
    }
    sign = sign.toLocaleLowerCase();
    switch (sign) {
      case 'cmd':
        return 'meta';
      case 'ctrl':
        return 'control';
      case 'esc':
        return 'escape';
      default :
        return sign;
    }
  }
  pause(sign: string, key: string) {
    sign = this.translateSign(sign);
    const keyCode = this.getKeyCode(key);
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].sign === sign && this.arraySignatories[i].keyCode === keyCode) {
        this.arraySignatories[i].working = false;
      }
    }
  }
  continue(sign: string, key: string) {
    sign = this.translateSign(sign);
    const keyCode = this.getKeyCode(key);
    for (let i = 0; i < this.arraySignatories.length; ++i) {
      if (this.arraySignatories[i].sign === sign && this.arraySignatories[i].keyCode === keyCode) {
        this.arraySignatories[i].working = true;
      }
    }
  }
}
