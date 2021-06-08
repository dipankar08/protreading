export namespace dlog {
  export function d(msg?: string) {
    console.log(`\n[DEBUG]${msg || "null"}`);
  }
  export function e(msg?: string) {
    console.log(`[ERROR]${msg || "null"}`);
  }
  export function obj(obj?: Object, msg: string = "DEBUG OBJECT") {
    console.log(`=========================== ${msg} START ======================`);
    console.log(JSON.stringify(obj || {}, null, 1));
    console.log(`=========================== ${msg} END ======================`);
  }
  export function map(map: Map<string, any>) {
    console.log("=========================== DEBUG OBJECT  START ======================");
    for (let x in map.keys()) {
      console.log(`${JSON.stringify(x)} ==> ${JSON.stringify(map.get(x))}`);
    }
    console.log("=========================== DEBUG OBJECT END ======================");
  }
  export function ex(e: Error) {
    console.log(`[ERROR]${e.message}`);
    console.log(e.stack);
  }
}
