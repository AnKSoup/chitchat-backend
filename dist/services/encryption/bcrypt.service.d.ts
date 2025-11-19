export declare function encryptPassword(password: string): string;
export declare function isPasswordCorrect(data: string, encrypted: string): boolean;
export declare function validateUserPassword(user: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
//# sourceMappingURL=bcrypt.service.d.ts.map