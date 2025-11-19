export declare function createKeyAndIV(): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
export declare function encrypt(message: string, key: string, iv: string): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
export declare function decrypt(message: string, key: string, iv: string, tag: string): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
//# sourceMappingURL=conversation_encryption.service.d.ts.map