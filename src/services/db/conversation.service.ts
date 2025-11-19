//### Handles communication with the conversation table ###
//CRUD

import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { createKeyAndIV } from "../encryption/conversation_encryption.service.js";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "./safe_queries.service.js";

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
  const result = await updateItem("Conversation", conv, [
    `conversation_id = ${conversation_id}`,
  ]);
  return result;
}

export async function deleteConversation(conversation_id: number) {
  const result = await deleteItem("Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
  return result;
}

//Get owner id
export async function getOwnerId(conversation_id: number) {
  return await getItems(["owner_id"], "Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
}

export async function getConversation(conversation_id: number) {
  return await getItems(["*"], "Conversation", [
    `conversation_id = ${conversation_id}`,
  ]);
}
