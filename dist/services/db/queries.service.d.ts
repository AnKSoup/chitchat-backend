import "dotenv/config";
export declare function dbSelect(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number): Promise<unknown>;
export declare function dbSelectJoin(columns1: Array<string>, table1: string, columns2: Array<string>, table2: string, join1: string, join2: string, conditions?: Array<string>, limit?: number): Promise<unknown>;
export declare function dbInsert(table: string, object: object): Promise<unknown>;
export declare function dbUpdate(table: string, object: object, conditions: Array<string>): Promise<unknown>;
export declare function dbDelete(table: string, conditions: Array<string>): Promise<unknown>;
//# sourceMappingURL=queries.service.d.ts.map