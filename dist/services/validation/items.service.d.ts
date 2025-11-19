export declare function doesItemExist(columns: Array<string>, table: string, conditions: Array<string>): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function doesUserExist(id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
//# sourceMappingURL=items.service.d.ts.map