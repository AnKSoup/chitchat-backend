// Focuses on user testing

import { call } from "../assets/api_caller.js";
import { message1, user1 } from "../assets/data.js";

const messageRoute = "/message/";

// #1- Get all messages:  POST    /message/get:conversation_id REQ: {user_token, user_id, message_count, message_offset}
export async function GetAllMessagesOf(conversation) {
  const testing = `Gets all messages of ${conversation.conversation_name}`;
  try {
    const result = await call(
      "POST",
      messageRoute + "get/" + conversation.conversation_id,
      {
        user_token: user1.user_token,
        user_id: user1.user_id,
        message_count: 0,
        message_offset: 0,
      },
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Write message:     POST    /message/:conversation_id REQ: {user_token, user_id, message_content, in_response_to}
export async function WriteMessage1(conversation) {
  const testing = `Writing message 1 in ${conversation.conversation_name}`;
  try {
    const result = await call(
      "POST",
      messageRoute + conversation.conversation_id,
      {
        user_token: user1.user_token,
        user_id: message1.user_id,
        message_content: message1.message_content,
        message_tag: message1.message_tag,
        in_response_to: message1.in_response_to,
      },
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Edit message:      PUT     /message/:conversation_id REQ: {user_token, user_id, message_id, message_content}
export async function EditMessage1(conversation) {
  const testing = `Editing message 1 in ${conversation.conversation_name}`;
  try {
    const result = await call(
      "PUT",
      messageRoute + conversation.conversation_id,
      {
        user_token: user1.user_token,
        user_id: message1.user_id,
        message_id: message1.message_id,
        message_content: "New content!",
        message_tag: "New tag!",
      },
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #4- Delete message:    DELETE  /message/:conversation_id REQ: {user_token, user_id, message_id}
export async function DeleteMessage1(conversation) {
  const testing = `Deleting message 1 in ${conversation.conversation_name}`;
  try {
    const result = await call(
      "Delete",
      messageRoute + conversation.conversation_id,
      {
        user_token: user1.user_token,
        user_id: message1.user_id,
        message_id: message1.message_id,
      },
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
