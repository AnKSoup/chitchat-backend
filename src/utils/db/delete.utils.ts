import { dbQuery } from './connect.utils.js';
import { isOnlyQuery } from '../validation.utils.js';

export function DELETE(table: string, conditions: Array<string>) {
    const query = ` DELETE FROM ${table} WHERE ${conditions.join(' AND ')};`

    try {
        if (isOnlyQuery(query)) {
            return dbQuery(query);
        } else {
            return "Error, More than one Query";
        }
    } catch (error: any) {
        return error.message
    }

}
