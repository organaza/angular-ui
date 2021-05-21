declare module 'ally.js/esm/version';
declare module 'ally.js/esm/style';
declare module 'ally.js/esm/style/focus-source' {
  export function focusSource(): {
    disengage: () => void;
    current: () => 'pointer' | 'key' | 'script';
    used: (type: 'pointer' | 'key' | 'script') => void;
    lock: (type: 'pointer' | 'key' | 'script') => void;
    unlock: () => void;
  };
}
declare module 'ally.js/esm/query/focusable';
