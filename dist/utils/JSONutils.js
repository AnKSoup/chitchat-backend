// Jsonifies a string returned by a SELECT query. 
// RETURNS: a string, an array<object> or an object. 
export function jsonifySelect(string) {
    const rows = string.split("\n"); // Splits the query output by rows.
    const keys = rows[0]?.split("|"); // Stores the first row as keys.
    if (rows.length < 2) { // RETURNS if empty.
        return "ERROR: Empty";
    }
    else if (rows.length > 2) { // If multiple results: 
        let result = new Array(); // Declares an empty array to store the final result.
        for (let i = 1; i < rows.length; i++) { // Iterates through rows.
            const values = rows[i]?.split("|"); // Stores each value of the current row.
            if (keys != undefined && values != undefined) { // Typescript moment..
                result.push(arraysToJSON(keys, values)); // Push a JSON object into the final result array.
            }
        }
        return result; // RETURNS an array of JSON.
    }
    else { // If one result:
        const values = rows[1]?.split("|"); // Stores each value of the row.
        if (keys != undefined && values != undefined) { // Typescript moment..
            return arraysToJSON(keys, values); // RETURNS a JSON.  
        }
    }
}
// Takes in 2 array<string>
// RETURNS an object where arrKey values are the keys, arrVal values are the values.
function arraysToJSON(arrKey, arrVal) {
    let instance = new Array; // Declares an empty array to store the result of the loop bellow.
    for (let i = 0; i < arrKey.length; i++) { // Iterates through values.
        instance.push(`"${arrKey[i]}": "${arrVal[i]}"`); // Push a "key": "value" into the instance array.
    }
    return JSON.parse(`{ ${instance.join(",")} }`); // RETURNS a JSON.
}
//# sourceMappingURL=JSONutils.js.map