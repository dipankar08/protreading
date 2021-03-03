// Centralized Store and Event mechanism
class GlobalEvent {
  observers: ((arg0: string, arg1: any) => void)[];
  store: any;
  constructor() {
    this.observers = [];
    this.store = {};
  }

  // Add an observer to this.observers.
  addObserver(observer: (arg0: string, arg1: any) => void) {
    this.observers.push(observer);
    // we needs to catch on data.
    for (const [key, value] of Object.entries(this.store)) {
      if (value != undefined) {
        observer(key, value);
      }
    }
  }

  // Remove an observer from this.observers.
  removeObserver(observer: any) {
    const removeIndex = this.observers.findIndex((obs: any) => {
      return observer === obs;
    });
    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  // Loops over this.observers and calls the update method on each observer.
  // The state object will call this method overtime it is updated.
  notify(type: string, data: any) {
    console.log(`[LOCAL EVENT] Sending notification for ${type} to ${this.observers.length} observers`);
    this.store[type] = data;
    if (this.observers.length > 0) {
      this.observers.forEach((observer: (arg0: any, arg1: any) => any) => observer(type, data));
    }
  }
  set(key: string, value: any) {
    this.store[key] = value;
  }
  // get the last stored data
  get(key: string) {
    return this.store[key];
  }
  get_or_throw(key: string) {
    if (this.store[key]) {
      return this.store[key];
    } else {
      throw `${key} not found in local event`;
    }
  }
}

export const localEvent: GlobalEvent = new GlobalEvent();
(window as any).localEvent = localEvent;
// We can always has this have this it as a session
localEvent.set(
  "session_id",
  Math.random()
    .toString(36)
    .substring(7)
);
