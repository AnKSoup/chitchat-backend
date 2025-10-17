import { SELECT } from "./db/select.utils.js";
// ### TO PREVENT INJECTIONS ###
const queryWords = ["SELECT", "INSERT", "UPDATE", "DELETE"];
// Blacklist other except ...
// RETURNS bool
export function isOnlyWord(word, string) {
    const check = string.toUpperCase(); // Puts everything in uppercase for easier checks.
    const wordCheck = word.toUpperCase();
    const occurences = check.match(new RegExp(queryWords.join("|"), "g")); // Checks for all the queryWords.
    if (occurences && occurences.every((val, i, arr) => val === arr[0])) { // Checks if everything in the array are equal (ty StackOverflow). DO NOT REMOVE THE "i"!!!
        return occurences[0] == wordCheck; // RETURNS true if the word to check is equal to the array.
    }
    else
        return false; // RETURNS false otherwise.
}
// Auto Blacklist
// auto detects first word as either of those: SELECT INSERT UPDATE DELETE.
export function isOnlyFirstWord(string) {
    const check = string.toUpperCase();
    const occurences = check.match(new RegExp(queryWords.join("|"), "g")); // Checks for all the queryWords.
    if (occurences) {
        return isOnlyWord(occurences[0], check); // Takes the first element.
    }
    else
        return false;
}
// Only allow one query.
export function isOnlyQuery(string) {
    const check = string.toUpperCase();
    const occurences = check.match(new RegExp(queryWords.join("|"), "g"))?.length; // Checks for all the queryWords.
    if (occurences && occurences == 1) { // if only one query RETURNS true.
        return true;
    }
    else
        return false;
}
// ### TO PREVENT UNWANTED BODY PARAMS ###
export function allowOnly(object, array) {
    const obj = Object.keys(object); //Gets values.
    const arr = array;
    if (obj.length != arr.length) { //If not same length:
        return false; //Returns false
    }
    for (let i = 0; i < obj.length; i++) { //Iterates through each value of obj:
        let found = false; //No matches found until proven otherwise. 
        for (let j = 0; j < arr.length; j++) { //Iterates through each value of arr:
            if (obj[i] == arr[j]) { //Am I the same?
                found = true; //found is changed to yes.
                break; //Breaks.
            }
            ;
        }
        if (!found) { //Is not found?
            return false; //Returns false.
        }
    }
    return true; //Returns true since everything matched!
}
export function prevents(object, array) {
    const obj = Object.keys(object); //Gets values.
    const arr = array;
    for (let i = 0; i < obj.length; i++) { //Iterates through each value of obj:
        for (let j = 0; j < arr.length; j++) { //Iterates through each value of arr:
            if (obj[i] == arr[j]) { //Am I the same?
                return true; //Returns true => undesired value found!
            }
        }
    }
    return false; //Returns false => nothing wrong found.
}
// ### TO VALIDATE USER TOKEN ###
//Returns user_id or undefined  
export function getUserID(token) {
    try {
        const user_id = SELECT(['user_id'], 'User', [`user_token LIKE '${token}'`]).user_id;
        return user_id;
    }
    catch (error) {
        return undefined;
    }
}
//Returns false if token not found.
export function isTokenValid(token) {
    if (!getUserID(token)) {
        return false;
    }
    else {
        return true;
    }
}
//Returns true if token belongs to id.
export function isTokenOfID(token, id) {
    if (getUserID(token) == id) {
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=validation.utils.js.map