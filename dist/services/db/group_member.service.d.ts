export declare function joinChat(object: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function leaveChat(object: object, conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function isSafeToCreate(object: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function rejoinChat(object: object, conversation_id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function getAllConvsOfUser(user_id: number): Promise<unknown>;
//# sourceMappingURL=group_member.service.d.ts.map