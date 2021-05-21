import { ShortcutObservable } from '../lib/shortcut/shortcut.service';

export class ShortcutServiceStub {
  subscribe(): ShortcutObservable {
    return {
      id: '',
      observable: null,
      unsubscribe: () => {
        return;
      },
    } as ShortcutObservable;
  }
}
