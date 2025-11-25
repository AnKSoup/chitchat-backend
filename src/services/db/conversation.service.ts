//### Handles communication with the conversation table ###
//CRUD

import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { createKeyAndIV } from "../encryption/conversation_encryption.service.js";
import {
  createItem,
  deleteItem,
  getItems,
  getItemsJoin,
  updateItem,
} from "./safe_queries.service.js";

// #CRUD
export async function getConversation(conversation_id: number) {
  return await getItems(["*"], "Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
}

export async function createConversation(conv: object) {
  //Insert it into the database
  const result = await createItem("Conversation", conv);
  if (getSuccess(result)) {
    //Return the key and IV
    const keys = createKeyAndIV();
    const content = getProperty("content", keys);
    if (getSuccess(keys) && content) {
      return iro(
        true,
        "Created conversation successfully",
        201,
        "Conversation Key and IV in content.",
        content
      );
    } else {
      return iro(
        false,
        "Couldn't create key.",
        500,
        "Server couldn't generate a key."
      );
    }
  } else {
    return result;
  }
}

export async function updateConversation(
  conv: object,
  conversation_id: number
) {
  return await updateItem("Conversation", conv, [
    `conversation_id = ${conversation_id}`,
  ]);
}

export async function deleteConversation(conversation_id: number) {
  return await deleteItem("Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
}

// #LOGIC
//Get owner id
export async function getOwnerId(conversation_id: number) {
  return await getItems(["owner_id"], "Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
}

export async function getAllMembers(conversation_id: number) {
  //Get members where conv id = conv id
  return await await getItemsJoin(
    ["user_id"],
    "Group_Member",
    ["user_name"],
    "User",
    "user_id",
    "user_id",
    [`Group_Member.conversation_id = ${conversation_id}`]
  );
}
