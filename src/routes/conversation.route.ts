import { Router } from "express";
import {
  allowOnly,
  isPresent,
  prevents,
} from "../services/validation/params.service.js";
import {
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import {
  createConversation,
  deleteConversation,
  getAllMembers,
  getConversation,
  updateConversation,
} from "../services/db/conversation.service.js";
import { doesUserExist } from "../services/validation/items.service.js";
import { isTokenOfOwner, isTokenValid } from "../services/tokens.service.js";

export const routeConversation = Router();
// ENDPOINTS :
// #1- Get conv:      GET     /conversation/:id   RES: {*}
// #2- Create conv:   POST    /conversation/      REQ: {conversation_name, owner_id}                                  RES: {key, iv}
// #3- Update conv:   PUT     /conversation/:id   REQ: {user_token, ...,  !conversation_id, !conversation_created_at} RES: {message}
// #4- Delete conv:   DELETE  /conversation/:id   REQ: {user_token}                                                   RES: {message}
// #5- All members:   GET     /conversation/members_of/:conversation_id                                               RES: {user_id}

//#1- Retrieves a conversation by id:
routeConversation.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const result = getConversation(id);
  operationToResponse(res, result);
});

//2- Creates a new conversation:
routeConversation.post("/", async (req, res) => {
  const conv = req.body;

  const params = allowOnly(conv, ["conversation_name", "owner_id"]);
  if (validateOperation(res, params)) return;

  const user = await doesUserExist(conv.owner_id);
  if (validateOperation(res, user)) return;

  //Attempts to create a conversation.
  const result = await createConversation(conv);
  operationToResponse(res, result);
});

//3- Updates a conversation with id:
routeConversation.put("/:id", async (req, res) => {
  const conv = req.body;
  const id = parseInt(req.params.id);

  //Validating operations :
  const params = isPresent(conv, ["user_token"]);
  if (validateOperation(res, params)) return;

  const blacklist = prevents(conv, [
    "conversation_id",
    "conversation_created_at",
  ]);
  if (validateOperation(res, blacklist)) return;

  //IN case there is a change in owner: checks if it exists
  if (conv.owner_id) {
    const user = await doesUserExist(conv.owner_id);
    if (validateOperation(res, user)) return;
  }

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const owner = await isTokenOfOwner(token, id);
  if (validateOperation(res, owner)) return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user_token, ...convNoToken } = conv; //Strips out token out of conv object => move later.

  //Attempts to update a conversation.
  const result = await updateConversation(convNoToken, id);
  operationToResponse(res, result);
});

//4- Deletes a conversation:
routeConversation.delete("/:id", async (req, res) => {
  const conv = req.body;
  const id = parseInt(req.params.id);

  //Validating operations :
  const params = allowOnly(conv, ["user_token"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const owner = await isTokenOfOwner(token, id);
  if (validateOperation(res, owner)) return;

  //Attempts to delete a conversation.
  const result = await deleteConversation(id);
  operationToResponse(res, result);
});

//Gets all member of a conv
routeConversation.get("/members_of/:conversation_id", async (req, res) => {
  const conversation_id = parseInt(req.params.conversation_id);

  //Attempts to retrieve all members.
  const result = await getAllMembers(conversation_id);
  operationToResponse(res, result as object);
});
