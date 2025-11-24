// ### TO PREVENT UNWANTED BODY PARAMS ###
import { getProperty, iro } from "../../utils/responses.utils.js";
// //In case no params were sent:
// export function isParamNull(object: object) {
//   if (object == null) {
//     return iro(
//       false,
//       "No Parameters.",
//       400,
//       "No parameters were provided."
//     );
//   } else {
//     return message(true, "Params ok.");
//   }
// }
export function allowOnly(object, array) {
    //Will throw error if null object is null, additionally check for empty
    // Why? : Express will treat empty parameters differently based on the type of https requests.
    // Meaning: Get or Delete will give null and Post or Put will give {}.
    if (!object || Object.keys(object).length == 0) {
        return iro(false, "No parameters given.", 400, `Please provide those parameters : ${array.join(", ")}`);
    }
    const obj = Object.keys(object); //Gets values.
    const arr = array;
    if (obj.length != arr.length) {
        //If not same length:
        return iro(false, "Invalid number of parameters.", 400, `Please provide only ${arr.join(", ")}.`);
    }
    for (let i = 0; i < obj.length; i++) {
        //Iterates through each value of obj:
        let found = false; //No matches found until proven otherwise.
        for (let j = 0; j < arr.length; j++) {
            //Iterates through each value of arr:
            if (obj[i] == arr[j]) {
                //Am I the same?
                found = true; //found is changed to yes.
                break; //Breaks.
            }
        }
        if (!found) {
            //Is not found?
            return iro(false, "Invalid parameter.", 400, `${obj[i]} is not allowed.`);
        }
    }
    // everything matched!
    return iro(true, "Params ok.", 100, "Required params ok.");
}
export function prevents(object, array) {
    if (!object || Object.keys(object).length == 0) {
        return iro(false, "No parameters given.", 400, `Please provide those parameters : ${array.join(", ")}`);
    }
    const obj = Object.keys(object); //Gets values.
    const arr = array;
    for (let i = 0; i < obj.length; i++) {
        //Iterates through each value of obj:
        for (let j = 0; j < arr.length; j++) {
            //Iterates through each value of arr:
            if (obj[i] == arr[j]) {
                //Am I the same?
                //=> Undesired value found!
                return iro(false, "Invalid parameter.", 400, `${obj[i]} is not allowed.`);
            }
        }
    }
    // nothing wrong found.
    return iro(true, "Params ok.", 100, "Required params ok.");
}
//Succeeds if everything is present!
export function isPresent(object, array) {
    if (!object || Object.keys(object).length == 0) {
        return iro(false, "No parameters given.", 400, `Please provide those parameters : ${array.join(", ")}`);
    }
    const obj = Object.keys(object); //Gets values.
    const arr = array;
    //Checks each element of the array.
    for (let i = 0; i < arr.length; i++) {
        //defaults to no match
        let result = false;
        // Iterates through object to check if present.
        for (let j = 0; j < obj.length; j++) {
            // if the same thing is found
            if (arr[i] == obj[j]) {
                result = true;
                break;
            }
        }
        //No match found
        if (result == false) {
            return iro(false, "Missing parameter.", 400, `${arr[i]} is missing.`);
        }
    }
    return iro(true, "Params ok.", 100, "Required params ok.");
}
export function isNotNull(object, array) {
    const obj = object;
    const arr = array;
    for (let i = 0; i < arr.length; i++) {
        if (!getProperty(arr[i], obj)) {
            return iro(false, "Missing parameters.", 400, `Ensure that ${arr[i]} is not null.`);
        }
    }
    return iro(true, "Params ok", 100, "No null params!");
}
//# sourceMappingURL=params.service.js.map