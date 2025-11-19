export declare function createToken(email: string): string;
export declare function isTokenValid(token: string): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function isTokenOfUser(tokenResult: object, id: number): object;
export declare function isTokenOfOwner(tokenResult: object, conversation_id: number): Promise<object>;
//# sourceMappingURL=tokens.service.d.ts.map