import { Router } from "express";
import { allowOnly } from "../services/validation/params.service.js";
import {
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import {
  isTokenOfOwner,
  isTokenOfUser,
  isTokenValid,
} from "../services/tokens.service.js";
import { doesConvExist, doesUserExist } from "../services/validation/items.service.js";
import { isMemberInConv } from "../services/db/group_member.service.js";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessagesFromConv,
  isMessageInConv,
  isMessageOfId,
} from "../services/db/message.service.js";

// ENDPOINTS :
// #1- Get all messages:  GET     /message/:conversation_id REQ: {user_token, user_id, message_count, message_offset}   RES: {messages}
// #2- Write message:     POST    /message/:conversation_id REQ: {user_token, user_id, message_content, in_response_to}
// #3- Edit message:      PUT     /message/:conversation_id REQ: {user_token, user_id, message_id, message_content}
// #4- Delete message:    DELETE  /message/:conversation_id REQ: {user_token, user_id, message_id}

export const routeMessage = Router();

//#1 GET ALL MESSAGES FROM A CONVERSATION from ... to ...
routeMessage.get("/:conversation_id", async (req, res) => {
  //check if user in conv and did not left
  const member = req.body;
  const conversation_id = parseInt(req.params.conversation_id);
  const count = req.body.message_count;
  const offset = req.body.message_offset;

  // Check for user identity
  const params = allowOnly(member, [
    "user_token",
    "user_id",
    "message_count",
    "message_offset",
  ]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(member.user_token);
  if (validateOperation(res, token)) return;

  const user = await doesUserExist(member.user_id);
  if (validateOperation(res, user)) return;

  const conv = await doesConvExist(conversation_id);
  if (validateOperation(res, conv as object)) return;

  const memberConv = await isMemberInConv(member.user_id, conversation_id);
  if (validateOperation(res, memberConv as object)) return;

  const result = await getMessagesFromConv(conversation_id, count, offset);
  operationToResponse(res, result as object);
});

//#2 WRITE A MESSAGE (possibly a response to another);
routeMessage.post("/:conversation_id", async (req, res) => {
  //check if user in conv and did not left
  const message = req.body;
  const conversation_id = parseInt(req.params.conversation_id);

  // WARNING : please pass content already encrypted
  // If not in response to put 0
  const params = allowOnly(message, [
    "user_token",
    "user_id",
    "message_content",
    "message_tag",
    "in_response_to",
  ]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(message.user_token);
  if (validateOperation(res, token)) return;

  const user = await doesUserExist(message.user_id);
  if (validateOperation(res, user)) return;

  const owner = isTokenOfUser(token, message.user_id);
  if (validateOperation(res, owner)) return;

  const conv = await doesConvExist(conversation_id);
  if (validateOperation(res, conv as object)) return;

  const member = await isMemberInConv(message.user_id, conversation_id);
  if (validateOperation(res, member as object)) return;

  const result = await createMessage(message, conversation_id);
  operationToResponse(res, result);
});

//#3 EDIT A MESSAGE
routeMessage.put("/:conversation_id", async (req, res) => {
  const message = req.body;
  const conversation_id = parseInt(req.params.conversation_id);

  // WARNING : please pass content already encrypted
  const params = allowOnly(message, [
    "user_token",
    "user_id",
    "message_id",
    "message_content",
    "message_tag",
  ]);
  if (validateOperation(res, params)) return;

  const exists = await isMessageInConv(message.message_id, conversation_id);
  if (validateOperation(res, exists)) return;

  const auth = await isMessageOfId(message.message_id, message.user_id);
  if (validateOperation(res, auth)) return;

  const token = await isTokenValid(message.user_token);
  if (validateOperation(res, token)) return;

  //Check if token of user or token of admin
  const user = isTokenOfUser(token, message.user_id);
  if (validateOperation(res, user)) return;

  const result = await editMessage(message.message_id, message.message_content, message.message_tag);
  operationToResponse(res, result);
});

//#4 DELETE A MESSAGE
routeMessage.delete("/:conversation_id", async (req, res) => {
  const message = req.body;
  const conversation_id = parseInt(req.params.conversation_id);

  const params = allowOnly(message, ["user_token", "user_id", "message_id"]);
  if (validateOperation(res, params)) return;

  const exists = await isMessageInConv(message.message_id, conversation_id);
  if (validateOperation(res, exists)) return;

  const token = await isTokenValid(message.user_token);
  if (validateOperation(res, token)) return;

  //Check if token of user or token of admin and if message is of user
  const auth = await isMessageOfId(message.message_id, message.user_id);
  const user = isTokenOfUser(token, message.user_id);
  const owner = await isTokenOfOwner(token, conversation_id);
  if (
    validateOperation(res, auth) &&
    validateOperation(res, user) &&
    validateOperation(res, owner)
  ) {
    return;
  }

  const result = await deleteMessage(message.message_id);
  operationToResponse(res, result);
});
