// To quickly validate and send a response using the internal operation response system aka {success : false}...

import { getStatus, getSuccess } from "../../utils/responses.utils.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function opertationToResponse(res: any, object: object) {
  res.status(getStatus(object)).send(object);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateOperation(res: any, object: object) {
  //Checks for success and returns if false.
  if (!getSuccess(object)) {
    opertationToResponse(res, object);
    return true;
  }
}

//Not working since it will not prevent other object from being created before being tested

// // Does the same thing in a loop.
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function validateOperations(res: any, objects: Array<object>) {
//   for (let i = 0; i < objects.length; i++) {
//     //Stops at the first error to prevent warnings: Could change? => Collect all errors and then em grouped?
//     const isFailed = validateOperation(res, objects[i] as object);
//     if (isFailed) {
//       return true;
//     }
//   }
// }
