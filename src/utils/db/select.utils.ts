// ### SELECT ... ###

import { dbQuery } from './connect.utils.js'
import { jsonifySelect } from '../json.utils.js';

export function SELECT(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number) {
    let query = `SELECT ${columns.join(', ')} FROM ${table}`;
    if (conditions) {
        query += ` WHERE ${conditions.join(' AND ')}`
    }
    if (limit) {
        query += ` LIMIT ${limit}`
    }
    query += ';'

    try {
        return jsonifySelect(dbQuery(query));
    } catch (error: any) {
        return error.message
    }
}

// Warning: risk of sql injection with the conditions array. 