export declare function getMessagesFromConv(conversation_id: number, count: number, offset: number): Promise<unknown>;
export declare function createMessage(message: object, conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function editMessage(message_id: number, message_content: string): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function deleteMessage(message_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function isMessageOfId(message_id: number, user_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function isMessageInConv(message_id: number, conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
//# sourceMappingURL=message.service.d.ts.map