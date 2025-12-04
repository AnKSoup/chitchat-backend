import { Router } from "express";
import {
  getAllConvsOfUser,
  isSafeToCreate,
  joinChat,
  leaveChat,
  rejoinChat,
} from "../services/db/group_member.service.js";
import { allowOnly } from "../services/validation/params.service.js";
import {
  onlyValidate,
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import {
  doesConvExist,
  doesUserExist,
} from "../services/validation/items.service.js";

import {
  isTokenOfOwner,
  isTokenOfUser,
  isTokenValid,
} from "../services/tokens.service.js";

export const routeGroupMember = Router();

// ENDPOINTS :
// #1- Join Chat:   POST  /group_member/                          REQ: {user_token,user_id,conversation_id,decrypt_key,decrypt_iv,} RES: {message}
// #2- Rejoin Chat: PUT   /group_member/rejoin/:conversation_id   REQ: {user_token,user_id,decrypt_key,decrypt_iv,}                 RES: {message}
// #3- Leave chat:  PUT   /group_member/leave/:conversation_id    REQ: {user_token,user_id}                                         RES: {message}
// #4- All conv:    GET   /group_member/conversation_of/:user_id"                                                                   RES: {conversation_id}

//#1 Join chat:
routeGroupMember.post("/", async (req, res) => {
  const member = req.body;

  //WARNING : please pass decrypt_key and decrypt_iv already encrypted
  const params = allowOnly(member, [
    "user_token",
    "user_id",
    "conversation_id",
    "decrypt_key",
    "decrypt_iv",
  ]);
  if (validateOperation(res, params)) return;

  const isSafe = await isSafeToCreate(member);
  if (validateOperation(res, isSafe)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const owner = await isTokenOfOwner(token, member.conversation_id);
  if (validateOperation(res, owner)) return;

  const user = await doesUserExist(member.user_id);
  if (validateOperation(res, user)) return;

  const conv = await doesConvExist(member.conversation_id);
  if (validateOperation(res, conv as object)) return;

  const result = await joinChat(member);
  operationToResponse(res, result);
});

//#2 Rejoin chat
routeGroupMember.put("/rejoin/:conversation_id", async (req, res) => {
  const member = req.body;
  const conversation_id = parseInt(req.params.conversation_id);

  //WARNING : please pass decrypt_key and decrypt_iv already encrypted
  const params = allowOnly(member, [
    "user_token",
    "user_id",
    "decrypt_key",
    "decrypt_iv",
  ]);
  if (validateOperation(res, params)) return;

  const isSafe = await isSafeToCreate(member);
  if (validateOperation(res, isSafe)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const owner = await isTokenOfOwner(token, conversation_id);
  if (validateOperation(res, owner)) return;

  const user = await doesUserExist(member.user_id);
  if (validateOperation(res, user)) return;

  const conv = await doesConvExist(conversation_id);
  if (validateOperation(res, conv as object)) return;

  const result = await rejoinChat(member, conversation_id);
  operationToResponse(res, result);
});

//#3 Leave chat:
routeGroupMember.put("/leave/:conversation_id", async (req, res) => {
  const member = req.body;
  const conversation_id = parseInt(req.params.conversation_id);

  const params = allowOnly(member, ["user_id", "user_token"]);
  if (validateOperation(res, params)) return;

  // Either owner or user can do so
  // TOKEN => is token of user or owner
  const conv = await doesConvExist(conversation_id);
  if (validateOperation(res, conv as object)) return;

  const exists = await doesUserExist(member.user_id);
  if (validateOperation(res, exists)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  //Checks if id is of user or owner
  const user = isTokenOfUser(token, member.user_id);
  const owner = await isTokenOfOwner(token, conversation_id);
  if (onlyValidate(user) && onlyValidate(owner)) {
    validateOperation(res, user);
    validateOperation(res, owner);
    return;
  }

  const result = await leaveChat(member, conversation_id);
  operationToResponse(res, result);
});

//#4 Gets all conv of a user
routeGroupMember.get("/conversation_of/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  //Attempts to retrieve all conv.
  const result = await getAllConvsOfUser(user_id);
  operationToResponse(res, result as object);
});
