import { dbQuery } from './connect.utils.js';
import { isOnlyQuery } from '../validation.utils.js';
export function DELETE(table, conditions) {
    const query = ` DELETE FROM ${table} WHERE ${conditions.join(' AND ')};`;
    if (isOnlyQuery(query)) {
        return dbQuery(query);
    }
    else {
        throw new Error("Error: More than one Query");
    }
}
//# sourceMappingURL=delete.utils.js.map