// ### SELECT ... ###
import { dbQuery } from './connect.utils.js';
import { jsonifySelect } from '../json.utils.js';
export function SELECT(columns, table, conditions, limit) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (conditions) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    query += ';';
    try {
        return jsonifySelect(dbQuery(query));
    }
    catch (error) {
        return error.message;
    }
}
//# sourceMappingURL=select.utils.js.map