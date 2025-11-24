export declare function createConversation(conv: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function updateConversation(conv: object, conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function deleteConversation(conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function getOwnerId(conversation_id: number): Promise<unknown>;
export declare function getConversation(conversation_id: number): Promise<unknown>;
export declare function doesConvExist(conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function getAllMembers(conversation_id: number): Promise<unknown>;
//# sourceMappingURL=conversation.service.d.ts.map