// Focuses on user testing

import { call } from "../assets/api_caller.js";
import { member1, user1 } from "../assets/data.js";

const memberRoute = "/group_member/";

// #1- Join Chat:   POST  /group_member/                          REQ: {user_token,user_id,conversation_id,decrypt_key,decrypt_iv,}
export async function JoinChat(user) {
  const testing = `Let ${user.user_name} join conversation_1`;
  try {
    const result = await call("POST", memberRoute, {
      user_token: user1.user_token,
      user_id: user.user_id,
      conversation_id: 1,
      decrypt_key: member1.decrypt_key,
      decrypt_iv: member1.decrypt_iv,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Rejoin Chat: PUT   /group_member/rejoin/:conversation_id   REQ: {user_token,user_id,decrypt_key,decrypt_iv,}
export async function RejoinChat(user) {
  const testing = `Let ${user.user_name} rejoin conversation_1`;
  try {
    const result = await call("PUT", memberRoute + "rejoin/1", {
      user_token: user1.user_token,
      user_id: user.user_id,
      decrypt_key: member1.decrypt_key,
      decrypt_iv: member1.decrypt_iv,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Leave chat:  PUT   /group_member/leave/:conversation_id    REQ: {user_token,user_id}
export async function LeaveChat(user) {
  const testing = `Let ${user.user_name} leave conversation_1`;
  try {
    const result = await call("PUT", memberRoute + "leave/1", {
      user_token: user1.user_token,
      user_id: user.user_id,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #4- All conv:    GET   /group_member/conversation_of/:user_id"
export async function GetAllConvOf(user) {
  const testing = `Getting all conversations of ${user.user_name}`;
  try {
    const result = await call(
      "GET",
      memberRoute + "conversation_of/" + user.user_id,
    );
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #5- Get key/iv   POST  /group_member/key_iv_of/                REQ: {user_id, conversation_id}                                                                  RES: {decrypt_key,decrypt_iv}
export async function GetKeyIv(user) {
  const testing = `Getting key and iv of member ${user.user_name} in conversation_1`;
  try {
    const result = await call("POST", memberRoute + "key_iv_of/", {
      user_id: user.user_id,
      conversation_id: 1,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
