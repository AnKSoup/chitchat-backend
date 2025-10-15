// ### SELECT ... ###
import { dbQuery } from './connect.utils.js';
import { jsonifySelect } from '../json.utils.js';
import { isOnlyQuery } from '../validation.utils.js';
export function SELECT(columns, table, conditions, limit) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (conditions) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    query += ';';
    if (isOnlyQuery(query)) {
        return jsonifySelect(dbQuery(query));
    }
    else {
        throw new Error("Error: More than one Query");
    }
}
//# sourceMappingURL=select.utils.js.map