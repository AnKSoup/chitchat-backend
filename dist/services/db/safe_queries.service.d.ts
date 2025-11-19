export declare function getItems(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number): Promise<unknown>;
export declare function createItem(table: string, item: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function updateItem(table: string, item: object, conditions: Array<string>): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function deleteItem(table: string, conditions: Array<string>): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function itemsToArray(result: unknown): object[] | undefined;
//# sourceMappingURL=safe_queries.service.d.ts.map