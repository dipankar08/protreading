import { TObject } from "@/common/types";
import _ from "underscore";
import { assertOrThrow } from "./assert";
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
      // for override, we will not notify the first one which is pass by the constarctor
      for (let x of this._observers.slice(1)) {
        x(this._object);
      }
    }
  }

  // set a property of the object
  set(key: string, value: any, notify = true) {
    this._object[key] = value;
    if (notify) this._notify();
  }

  // This will append a value for a key, where obj[key] is a array
  pushToArray(key: string, value: any, notify = true) {
    if (!this._object[key]) {
      this._object[key] = [];
    } else {
      assertOrThrow(_.isArray(this._object[key]), "you can't append to a non-array", "");
    }
    this._object[key].push(value);

    if (notify) this._notify();
  }

  _notify() {
    for (let x of this._observers) {
      x(this._object);
    }
  }

  // You can remove an item from the object value as array
  popFromArray(key: string, _id: any, notify = true) {
    if (!_.isArray(this._object[key])) {
      return;
    }
    for (let x = 0; x < this._object[key].length; x++) {
      if (this._object[key][x]._id == _id && _id) {
        this._object[key].splice(x, 1);
        if (notify) this._notify();
        return;
      }
    }
  }

  // add observer
  addObserver(observer: (arg0: object) => void) {
    this._observers.push(observer);
    // perform catchup
    if (Object.keys(this._object).length > 0) {
      observer(this._object);
    }
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
