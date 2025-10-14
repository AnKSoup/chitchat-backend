import { dbQuery } from './connect.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';

// Inserts a JSON in a given table.
export function INSERT(table: string, object: Object) {
    let values = Object.values(object);                                     //Gets values.
    if (values) {
        for (let i = 0; i < values.length; i++) {                           //Iterates through values.
            if (typeof values[i] == 'string') {                             //If string:
                if (values[i].search("'") != -1) {                              //If contains "'""
                    values.splice(i, 1, values[i].replaceAll("'", "''"));       //Replace with "\'"
                }
                values.splice(i, 1, `'${values[i]}'`);                          //string becomes "string"
            }
        }
    }
    // Creates and excecutes query:
    const query = `INSERT INTO ${table} (${Object.keys(object).join(', ')}) VALUES (${Object.values(values).join(', ')});`;
    try {
        if (isOnlyWord('INSERT', query) && isOnlyQuery(query)) {
            return dbQuery(query);
        } else {
            return "Error, More than one Query";
        }
    } catch (error: any) {
        return error.message
    }
}