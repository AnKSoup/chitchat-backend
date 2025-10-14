import { dbQuery } from './connect.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';
import { betterStrings } from '../json.utils.js';
export function UPDATE(table, object, conditions) {
    let query = `UPDATE ${table} SET `; //Inits the query.
    const values = betterStrings(Object.values(object)); //Inits the values.
    for (let i = 0; i < values.length; i++) { //Iterates through the values
        query += `${Object.keys(object)[i]} = ${values[i]}, `; //Adds the values to the query.
    }
    query = query.slice(0, -2); //Removes the last ", "
    query += ` WHERE ${conditions.join(' AND ')};`; //Adds the conditions.
    try { //Executes the query.
        if (isOnlyWord('UPDATE', query) && isOnlyQuery(query)) {
            return dbQuery(query);
        }
        else {
            return "Error, More than one Query";
        }
    }
    catch (error) {
        return error.message;
    }
}
//# sourceMappingURL=update.utils.js.map