export declare function getUser(columns: Array<string>, conditions?: Array<string>, limit?: number): Promise<unknown>;
export declare function createUser(user: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function updateUser(user: object, conditions: Array<string>): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function deleteUser(conditions: Array<string>): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function usersToArray(result: unknown): object[] | undefined;
export declare function emailToPassword(user: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function signinUser(user: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function loginUser(user: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function logoutUser(tokenResult: object): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function getUserById(user_id: number): Promise<unknown>;
export declare function getUserByName(user_name: string): Promise<unknown>;
export declare function editUser(user: object, id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function removeUser(id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
}>;
export declare function changeUserPassword(object: object, id: number): Promise<{
    success: boolean;
    title: string;
    status: number;
    detail: string;
    content: object | undefined;
} | undefined>;
//# sourceMappingURL=user.service.d.ts.map