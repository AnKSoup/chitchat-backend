import { dbQuery } from './connect.utils.js';
import { isOnlyQuery } from '../validation.utils.js';
import { betterStrings } from '../json.utils.js';

// Inserts a JSON in a given table.
export function INSERT(table: string, object: Object) {
    const query = `INSERT INTO ${table} (${Object.keys(object).join(', ')}) VALUES (${betterStrings(Object.values(object)).join(', ')});`;

    if (isOnlyQuery(query)) {
        return dbQuery(query);
    } else {
        throw new Error("Error: More than one Query");
    }
}