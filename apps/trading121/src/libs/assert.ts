export function verifyOrCrash(cond: boolean, msg = "Verify and crash called") {
  if (!cond) {
    throw new Error(msg);
  }
}
