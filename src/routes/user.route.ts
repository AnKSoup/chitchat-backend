// For clarity each route should e built like : validation then operation then response

import { Router } from "express";
import {
  allowOnly,
  isPresent,
  prevents,
} from "../services/validation/params.service.js";
import {
  isEmailValid,
  isPasswordValid,
} from "../services/validation/credentials.service.js";
import {
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import {
  changeUserPassword,
  editUser,
  getUserById,
  getUserByName,
  loginUser,
  logoutUser,
  removeUser,
  signinUser,
} from "../services/db/user.service.js";
import { isTokenOfUser, isTokenValid } from "../services/tokens.service.js";

/*
TODO implements : Reset password:
1: Find user_id with user_email
2: Create temporary token like 'recovery_123456'
3: Send email : link of a page like recovery/ticket and code like numeric half of temporary token
4: call /user/change_pass/:id with user_token as recovery_yournumericalcode and new user_password
--------------------------------------------------------------------------------------------------
ENDPOINTS :
#1- Sign in:    POST    /user/                  REQ: {user_name, user_email, user_password}                         RES: {message}
#2- Log in:     POST    /user/login             REQ: {user_email, user_password}                                    RES: {message|user_token}
#3- Log out:    POST    /user/logout            REQ: {user_token}                                                   RES: {message}
#4- Get by id:  GET     /user/:id
#5- Update:     PUT     /user/:id               REQ: {user_token, ..., !user_id, !user_password, !user_created_at}  RES: {message}
#6- Delete:     DELETE  /user/:id               REQ: {user_token}                                                   RES: {message}
#7- Get id:     POST    /user/get_id            REQ: {user_token}                                                   RES: {user_id|message}
#8- Get b name: GET     /user/search/:username                                                                      RES: {user_id, user_name|message}
#9- Chang pass: PUT     /user/change_pass/:id   REQ: {user_token, user_password}                                    RES: {message}

USELESS FOR NOW : 
*/

export const routeUser = Router();

// // For testing purposes: TO DELETE
// routeUser.get('/', (req, res) => {
//     res.send(SELECT(['*'], 'User'));
// });

// #1- Sign in:
routeUser.post("/", async (req, res) => {
  const user = req.body;

  //Validating operations :
  const params = allowOnly(user, ["user_name", "user_email", "user_password"]);
  if (validateOperation(res, params)) return;

  const email = isEmailValid(user.user_email);
  if (validateOperation(res, email)) return;

  const password = isPasswordValid(user.user_password);
  if (validateOperation(res, password)) return;

  //Attempting to sign in user:
  const result = await signinUser(user);
  operationToResponse(res, result);
});

// #2- Log in:
routeUser.post("/login", async (req, res) => {
  const user = req.body;

  //Validating operations :
  const params = allowOnly(user, ["user_email", "user_password"]);
  if (validateOperation(res, params)) return;

  //Attempting to log in user:
  const result = await loginUser(user);
  operationToResponse(res, result);
});

// #3- Log out:
routeUser.post("/logout", async (req, res) => {
  const user = req.body;

  //Validating operations :
  const params = allowOnly(user, ["user_token"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  //Attempting to log out with the generated token result:
  const result = await logoutUser(token);
  operationToResponse(res, result);
});

//#4- Get by id:
routeUser.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  //Attempts to retrieve user:
  const result = await getUserById(id);
  operationToResponse(res, result as object);
});

//#5- Update user info by id with token verification :
routeUser.put("/:id", async (req, res) => {
  const user = req.body;
  const id = parseInt(req.params.id);

  //Validating operations :
  const params = isPresent(user, ["user_token"]);
  if (validateOperation(res, params)) return;

  const blacklist = prevents(user, [
    "user_id",
    "user_password",
    "user_created_at",
  ]);
  if (validateOperation(res, blacklist)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, id);
  if (validateOperation(res, auth)) return;

  //Attempts to edit user:
  const result = await editUser(user, id);
  operationToResponse(res, result);
});

//#6- Deletes user by id:
routeUser.delete("/:id", async (req, res) => {
  const user = req.body;
  const id = parseInt(req.params.id);

  //Validating operations :
  const params = allowOnly(user, ["user_token"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, id);
  if (validateOperation(res, auth)) return;

  //Attempts to remove user:
  const result = await removeUser(id);
  operationToResponse(res, result);
});

//#7- GET ID with token:
routeUser.post("/get_id", async (req, res) => {
  const user = req.body;

  //Validating operations :
  const params = allowOnly(user, ["user_token"]);
  if (validateOperation(res, params)) return;

  //Attempts to retrieve user_id:
  const result = await isTokenValid(req.body.user_token); //always returns user_id if it's valid.
  operationToResponse(res, result);
});

//#8- GET user by name:
routeUser.get("/search/:username", async (req, res) => {
  const result = await getUserByName(req.params.username);
  operationToResponse(res, result as object);
});

//#9- Change password:
routeUser.put("/change_pass/:id", async (req, res) => {
  const user = req.body;
  const id = parseInt(req.params.id);

  //Validating operations :
  const params = allowOnly(user, ["user_token", "user_password"]); // Only token and new password
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, id);
  if (validateOperation(res, auth)) return;

  const password = isPasswordValid(user.user_password);
  if (validateOperation(res, password)) return;

  //attempts to change password.
  const result = await changeUserPassword(user, id);
  operationToResponse(res, result as object);
});
