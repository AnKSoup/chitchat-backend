// Focuses on user testing

import { call } from "../assets/api_caller.js";
import { user1 } from "../assets/data.js";

const conversationRoute = "/conversation/";

// #1- Get conv:      GET     /conversation/:id
export async function GetConv(conversation) {
  const testing = `Getting conversation ${conversation.conversation_id}`;
  try {
    const result = await call(
      "GET",
      conversationRoute + conversation.conversation_id,
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Create conv:   POST    /conversation/      REQ: {conversation_name, owner_id}
export async function CreateConv(conversation, member) {
  const testing = `Creating ${conversation.conversation_name}`;
  try {
    const result = await call("POST", conversationRoute, {
      conversation_name: conversation.conversation_name,
      owner_id: conversation.owner_id,
    });

    if (result.content) {
      // Adding it to owner member1 = user1
      member.decrypt_key = result.content.key;
      member.decrypt_iv = result.content.iv;
    }

    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Update conv:   PUT     /conversation/:id   REQ: {user_token, ...,  !conversation_id, !conversation_created_at}
export async function UpdateConv(conversation) {
  const testing =
    `Updating ${conversation.conversation_name} to changed_conversation${conversation.conversation_id}` +
    conversation.conversation_id;
  try {
    const result = await call(
      "PUT",
      conversationRoute + conversation.conversation_id,
      {
        user_token: user1.user_token,
        conversation_name: `changed_conversation${conversation.conversation_id}`,
      },
    );
    conversation.conversation_name = `changed_conversation${conversation.conversation_id}`;
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #4- Delete conv:   DELETE  /conversation/:id   REQ: {user_token}
export async function DeleteConv(conversation) {
  const testing = `Deleting ${conversation.conversation_name}`;
  try {
    const result = await call(
      "DELETE",
      conversationRoute + conversation.conversation_id,
      {
        user_token: user1.user_token,
      },
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #5- All members:   GET     /conversation/members_of/:conversation_id
export async function GetMembersOf(conversation) {
  const testing = `Getting members of conversation ${conversation.conversation_id}`;
  try {
    const result = await call(
      "GET",
      conversationRoute + "members_of/" + conversation.conversation_id,
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
