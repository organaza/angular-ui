export class JSONUtils {
  constructor(color: string, opts?: any) {
  }
  static parse(text: string, def: any): any {
    let result = def;
    try {
      result = JSON.parse(text);
    } catch (e) {
      result = def;
    }
    if (!result) {
      result = def;
    }
    return result;
  }
  static parseLocalStorage(key: string, def: any): any {
    let result = def;
    try {
      result = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      result = def;
    }
    if (!result) {
      result = def;
    }
    return result;
  }
  static setLocalStorage(key: string, def: any): any {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(def));
    }
  }
  static jsonClone(object: any): any {
    if (object === undefined) {
      object = null;
    }
    return JSON.parse(JSON.stringify(object));
  }
  static jsonCompare(objectA: any, objectB: any): boolean {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
  }
}
