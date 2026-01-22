//Handles blog logic

import { Router } from "express";
import {
  createBlog,
  getBlog,
  updateBlog,
} from "../services/db/blog.service.js";
import {
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import { isTokenOfUser, isTokenValid } from "../services/tokens.service.js";
import { allowOnly } from "../services/validation/params.service.js";

export const routeBlog = Router();
// ENDPOINTS :
// #1- Get a blog:      GET     /blog/:blog_id
// #2- Create a blog:   POST    /blog/:blog_id  REQ: {user_token}
// #3- Edit a blog:     PUT     /blog/:blog_id  REQ: {user_token, blog_content}
//Get
routeBlog.get("/:blog_id", async (req, res) => {
  const id = parseInt(req.params.blog_id);

  const result = await getBlog(id);
  operationToResponse(res, result as object);
});

//Create : Happens only once per user because unique blog per user
routeBlog.post("/:blog_id", async (req, res) => {
  const id = parseInt(req.params.blog_id);
  const body = req.body;

  const params = allowOnly(body, ["user_token"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, id);
  if (validateOperation(res, auth)) return;

  const result = await createBlog(id);
  operationToResponse(res, result as object);
});

//Update
routeBlog.put("/:blog_id", async (req, res) => {
  const id = parseInt(req.params.blog_id);
  const body = req.body;

  const params = allowOnly(body, ["user_token", "blog_content"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, id);
  if (validateOperation(res, auth)) return;

  const result = await updateBlog(id, body.blog_content);
  operationToResponse(res, result as object);
});
