export namespace dlog {
  export function d(msg: string) {
    console.log(`[DEBUG]${msg}`);
  }
  export function e(msg: string) {
    console.log(`[ERROR]${msg}`);
  }
  export function obj(obj: Object) {
    console.log(JSON.stringify(obj));
  }
  export function ex(e: Error) {
    console.log(`[ERROR]${e.message}`);
    console.log(e.stack);
  }
}
