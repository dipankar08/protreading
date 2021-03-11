import { TObject } from "@/common/types";
type HOOK = {
  onPush: (item: string | null, all_item?: any) => void;
  onPop: (item: string | null, all_item?: any) => void;
};
export class LiveDataArray {
  hooks: HOOK;
  _array: any[];
  _observers: ((item: any[]) => void)[];
  constructor(hooks: HOOK) {
    this.hooks = hooks;
    this._array = [];
    this._observers = [];
  }
  set(items: any[]) {
    this._array = items;
    for (let x of this._observers) {
      x(this._array);
    }
  }
  push(item: any) {
    this._array.push(item);
    this.hooks.onPush(item, this._array);
    for (let x of this._observers) {
      x(this._array);
    }
  }
  pop() {
    let item = this._array.pop();
    this.hooks.onPop(item, this._array);
    for (let x of this._observers) {
      x(this._array);
    }
  }
  popByKey(key: string) {
    let index = -1;
    for (var i = 0; i < this._array.length; i++) {
      if (this._array[i].key == key) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      let item = this._array.splice(i, 1);
      this.hooks.onPop(item[0], this._array);
      for (let x of this._observers) {
        x(this._array);
      }
    }
  }
  // add observer
  addObserver(observer: (arg0: string) => void) {
    this._observers.push(observer);
  }

  // remove observer
  removeObserver(observer: any) {
    const removeIndex = this._observers.findIndex((obs: any) => {
      return observer === obs;
    });
    if (removeIndex !== -1) {
      this._observers = this._observers.slice(removeIndex, 1);
    }
  }
}

///// Live Object
type TOnModified = (all_item?: any, key?: string) => void;
export class LiveObject {
  _object: TObject = {};
  _observers: TOnModified[];
  constructor(hooks: TOnModified) {
    this._object = [];
    this._observers = [hooks];
  }
  // Just override the old object by the new one.
  override(item: TObject, notify = true) {
    this._object = item;
    if (notify) {
      for (let x of this._observers) {
        x(this._object);
      }
    }
  }

  // set a property of the object
  set(key: string, value: any, notify = true) {
    this._object[key] = value;
    if (notify) {
      for (let x of this._observers) {
        x(this._object);
      }
    }
  }
  // add observer
  addObserver(observer: (arg0: object) => void) {
    this._observers.push(observer);
  }

  // remove observer
  removeObserver(observer: any) {
    const removeIndex = this._observers.findIndex((obs: any) => {
      return observer === obs;
    });
    if (removeIndex !== -1) {
      this._observers = this._observers.slice(removeIndex, 1);
    }
  }
}
