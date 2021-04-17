export namespace dlog {
  export function d(msg: string) {
    console.log(`[DEBUG]${msg}`);
  }
  export function e(msg: string) {
    console.log(`[ERROR]${msg}`);
  }
  export function obj(obj: Object) {
    console.log("=========================== DEBUG OBJECT  START ======================");
    console.log(JSON.stringify(obj));
    console.log("=========================== DEBUG OBJECT END ======================");
  }
  export function ex(e: Error) {
    console.log(`[ERROR]${e.message}`);
    console.log(e.stack);
  }
}
