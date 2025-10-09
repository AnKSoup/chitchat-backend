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
//# sourceMappingURL=validation.utils.js.map