// ### SELECT ... ###

import { dbQuery } from './connect.utils.js';
import { jsonifySelect } from '../json.utils.js';
import { isOnlyQuery } from '../validation.utils.js';

export function SELECT(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (conditions) {
        query += ` WHERE ${conditions.join(' AND ')}`
    }
    if (limit) {
        query += ` LIMIT ${limit}`
    }
    query += ';'

    if (isOnlyQuery(query)) {
        return jsonifySelect(dbQuery(query));
    } else {
        throw new Error("Error: More than one Query");
    }
}