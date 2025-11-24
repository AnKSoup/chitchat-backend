export declare function createKeyAndIV(): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
export declare function encryptMessage(message: string, key: string, iv: string): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
export declare function decryptMessage(message: string, key: string, iv: string, tag: string): {
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
};
export declare function createPair(): {
    publicKey: string;
    privateKey: string;
};
export declare function encryptKey(publicKey: string, key: string): string;
export declare function decryptKey(privateKey: string, encryptedKey: string): string;
//# sourceMappingURL=conversation_encryption.service.d.ts.map