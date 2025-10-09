// ### SELECT ... ###
import { dbQuery } from './connect.utils.js';
import { jsonifySelect } from '../json.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';
import { error } from 'console';
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
        if (isOnlyWord('SELECT', query) && isOnlyQuery(query)) {
            return jsonifySelect(dbQuery(query));
        }
        else {
            return "Error, More than one Query";
        }
    }
    catch (error) {
        return error.message;
    }
}
//# sourceMappingURL=select.utils.js.map