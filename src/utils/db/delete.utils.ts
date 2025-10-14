import { dbQuery } from './connect.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';

export function DELETE(table: string, conditions: Array<string>) {
    const query = ` DELETE FROM ${table} WHERE ${conditions.join(' AND ')};`

    try {
        if (isOnlyWord('DELETE', query) && isOnlyQuery(query)) {
            return dbQuery(query);
        } else {
            return "Error, More than one Query";
        }
    } catch (error: any) {
        return error.message
    }

}
