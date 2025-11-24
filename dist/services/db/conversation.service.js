//### Handles communication with the conversation table ###
//CRUD
import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { createKeyAndIV } from "../encryption/conversation_encryption.service.js";
import { doesItemExist } from "../validation/items.service.js";
import { createItem, deleteItem, getItems, updateItem, } from "./safe_queries.service.js";
export async function createConversation(conv) {
    //Insert it into the database
    const result = await createItem("Conversation", conv);
    if (getSuccess(result)) {
        //Return the key and IV
        const keys = createKeyAndIV();
        const content = getProperty("content", keys);
        if (getSuccess(keys) && content) {
            return iro(true, "Created conversation successfully", 201, "Conversation Key and IV in content.", content);
        }
        else {
            return iro(false, "Couldn't create key.", 500, "Server couldn't generate a key.");
        }
    }
    else {
        return result;
    }
}
export async function updateConversation(conv, conversation_id) {
    return await updateItem("Conversation", conv, [
        `conversation_id = ${conversation_id}`,
    ]);
}
export async function deleteConversation(conversation_id) {
    return await deleteItem("Conversation", [
        `conversation_id = ${conversation_id}`,
    ]);
}
//Get owner id
export async function getOwnerId(conversation_id) {
    return await getItems(["owner_id"], "Conversation", [
        `conversation_id = ${conversation_id}`,
    ]);
}
export async function getConversation(conversation_id) {
    return await getItems(["*"], "Conversation", [
        `conversation_id = ${conversation_id}`,
    ]);
}
export async function doesConvExist(conversation_id) {
    return await doesItemExist(["conversation_name"], "Conversation", [
        `conversation_id = ${conversation_id}`,
    ]);
}
export async function getAllMembers(conversation_id) {
    //Get members where conv id = conv id
    return await getItems(["user_id"], "Group_Member", [
        `conversation_id = ${conversation_id}`,
    ]);
}
//# sourceMappingURL=conversation.service.js.map