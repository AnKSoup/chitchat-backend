//Basic CRUD

import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { doesItemExist } from "../validation/items.service.js";
import {
  createItem,
  deleteItem,
  getItemsJoin,
  updateItem,
} from "./safe_queries.service.js";

//Gets all the message of a conversation within a given range
export async function getMessagesFromConv(
  conversation_id: number,
  count: number,
  offset: number
) {
  return await getItemsJoin(
    [
      "message_id",
      "message_content",
      "message_tag",
      "message_sent_at",
      "message_modified_at",
      "in_response_to",
    ],
    "Message",
    ["user_id", "user_name"],
    "User",
    "user_id",
    "user_id",
    [`conversation_id = ${conversation_id}`],
    "message_id",
    count,
    offset
  );
}

//Attempts to create a message.
export async function createMessage(message: object, conversation_id: number) {
  //Content encrypted by client
  const message_content = getProperty("message_content", message);
  const message_tag = getProperty("message_tag", message);
  const user_id = getProperty("user_id", message);
  //In response to ? => if "0" insert null
  let in_response_to = getProperty("in_response_to", message) as unknown;

  // Checks if message even exists in conversation
  const test = await isMessageInConv(in_response_to as number, conversation_id);
  if (in_response_to == 0) {
    in_response_to = null;
  } else if (!getSuccess(test)) {
    return iro(
      false,
      "Cannot reply to message.",
      400,
      "Message not in conversation."
    );
  }

  return await createItem("Message", {
    message_content: message_content,
    message_tag: message_tag,
    conversation_id: conversation_id,
    user_id: user_id,
    in_response_to: in_response_to,
  });
}

// Attempts to edit a message.
export async function editMessage(message_id: number, message_content: string, message_tag: string) {
  const date = new Date();
  return await updateItem(
    "Message",
    {
      message_content: message_content,
      message_tag: message_tag,
      message_modified_at: date.toISOString(),
    },
    [`message_id = ${message_id}`]
  );
}

// Attempts to delete a message.
export async function deleteMessage(message_id: number) {
  return await deleteItem("Message", [`message_id = ${message_id}`]);
}

// Checks if a message is the one of the id provided
export async function isMessageOfId(message_id: number, user_id: number) {
  return await doesItemExist(["message_id"], "Message", [
    `message_id = ${message_id}`,
    `user_id = ${user_id}`,
  ]);
}

// If message not exist in conv then impossible to operate on
export async function isMessageInConv(
  message_id: number,
  conversation_id: number
) {
  return await doesItemExist(["message_id"], "Message", [
    `message_id = ${message_id}`,
    `conversation_id = ${conversation_id}`,
  ]);
}
