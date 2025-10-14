import { dbQuery } from './connect.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';
export function DELETE(table, conditions) {
    const query = ` DELETE FROM ${table} WHERE ${conditions.join(' AND ')};`;
    try {
        if (isOnlyWord('DELETE', query) && isOnlyQuery(query)) {
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
//# sourceMappingURL=delete.utils.js.map