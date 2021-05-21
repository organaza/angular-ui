export class JSONUtils {
  static parse<T>(text: string, def?: T): T {
    let result = def;
    try {
      result = JSON.parse(text) as T;
    } catch (e) {
      if (def) {
        return def;
      }
      throw e;
    }
    return result;
  }
  static parseLocalStorage<T>(key: string, def: T): T {
    let result = def;
    try {
      result = JSON.parse(localStorage.getItem(key)) as T;
    } catch (e) {
      result = def;
    }
    if (!result) {
      result = def;
    }
    return result;
  }
  static setLocalStorage(key: string, def: unknown): void {
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(def));
    }
  }
  static jsonClone<T>(object: T): T {
    if (object === undefined) {
      object = null;
    }
    return JSON.parse(JSON.stringify(object)) as T;
  }
  static jsonCompare(objectA: unknown, objectB: unknown): boolean {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
  }

  static jsonDiff(
    objectA: unknown,
    objectB: unknown,
  ): { [s: string]: [unknown, unknown] } {
    const result = {};
    const keys = Array.from(
      new Set([...Object.keys(objectA), ...Object.keys(objectB)]),
    );
    for (const key of keys) {
      if (objectA[key] !== objectB[key]) {
        result[key] = [objectA[key], objectB[key]];
      }
    }
    return result;
  }
}
