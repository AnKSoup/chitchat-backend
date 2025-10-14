// ### SELECT ... ###

import { dbQuery } from './connect.utils.js';
import { jsonifySelect } from '../json.utils.js';
import { isOnlyWord, isOnlyQuery } from '../validation.utils.js';

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
        if (isOnlyWord('SELECT', query) && isOnlyQuery(query)) {
            return jsonifySelect(dbQuery(query));
        } else {
            return "Error, More than one Query";
        }
    } catch (error: any) {
        return error.message
    }
}