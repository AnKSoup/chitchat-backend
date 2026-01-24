import { Router } from "express";
import {
  deleteComment,
  editComment,
  getCommentById,
  getComments,
  isCommentOfBlog,
  isCommentOfUser,
  writeComment,
} from "../services/db/comment.service.js";
import {
  onlyValidate,
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import { allowOnly } from "../services/validation/params.service.js";
import { isTokenOfUser, isTokenValid } from "../services/tokens.service.js";
// import { doesUserExist } from "../services/validation/items.service.js";
import { doesBlogExist } from "../services/db/blog.service.js";

export const routeComment = Router();
/*
ENDPOINTS :
#1- comm from id:     GET     /comment/:comment_id                                                                                                        RES : IRO + [{"comment_id","comment_content","comment_created_at","comment_modified_at","in_response_to","user_id","blog_id"}]
#2- comms from blog:  POST    /comment/of/:blog_id                        REQ: {"limit","offset"}                                                         RES : IRO + [{"comment_id","comment_content","comment_created_at","comment_modified_at","in_response_to","user_id","blog_id","user_name"}]
#3- Write a comment:  POST    /comment/:blog_id                           REQ: {"user_id","user_token","comment_content","in_response_to"}                RES : IRO + {"rowid"}
#4- Edit a comment:   PUT     /comment/:comment_id                        REQ: {"user_id","user_token","comment_content"}                                 RES : IRO
#5- Delete a comm:    DELETE  /comment/:comment_id                        REQ: {"user_id","user_token","blog_id"}                                         RES : IRO
*/

//#1 Get comment from id
routeComment.get("/:comment_id", async (req, res) => {
  const id = parseInt(req.params.comment_id);

  const result = await getCommentById(id);
  operationToResponse(res, result as object);
});

//#2 Get all comments from a blog
routeComment.post("/of/:blog_id", async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.blog_id);
  const limit = parseInt(body.limit);
  const offset = parseInt(body.offset);

  const params = allowOnly(body, ["limit", "offset"]);
  if (validateOperation(res, params)) return;

  const result = await getComments(id, limit, offset);
  operationToResponse(res, result as object);
});

//#3 Write a comment
routeComment.post("/:blog_id", async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.blog_id);

  const params = allowOnly(body, [
    "user_id",
    "user_token",
    "comment_content",
    "in_response_to",
  ]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, body.user_id);
  if (validateOperation(res, auth)) return;

  //Need the blog to be created for posting comments
  const blog = await doesBlogExist(id);
  if (validateOperation(res, blog)) return;

  const result = await writeComment(id, body);
  operationToResponse(res, result as object);
});

//#4 Edit a comment
routeComment.put("/:comment_id", async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.comment_id);

  const params = allowOnly(body, ["user_id", "user_token", "comment_content"]);
  if (validateOperation(res, params)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  const auth = isTokenOfUser(token, body.user_id);
  if (validateOperation(res, auth)) return;

  //is comment of user /exists
  const comment = await isCommentOfUser(id, body.user_id);
  if (validateOperation(res, comment)) return;

  const result = await editComment(id, body);
  operationToResponse(res, result as object);
});

//#5 Delete a comment
routeComment.delete("/:comment_id", async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.comment_id);

  const params = allowOnly(body, ["user_id", "user_token", "blog_id"]);
  if (validateOperation(res, params)) return;

  //Is comment of blog
  const blog = await isCommentOfBlog(id, body.blog_id);
  if (validateOperation(res, blog)) return;

  const token = await isTokenValid(req.body.user_token);
  if (validateOperation(res, token)) return;

  //Needs to be neither of blog owner/user to fail
  const auth = isTokenOfUser(token, body.user_id);
  const owner = isTokenOfUser(token, body.blog_id);
  if (onlyValidate(auth) && onlyValidate(owner)) {
    validateOperation(res, auth);
    validateOperation(res, owner);
    return;
  }

  const comment = await isCommentOfUser(id, body.user_id);
  if (onlyValidate(comment) && onlyValidate(owner)) {
    validateOperation(res, comment);
    validateOperation(res, owner);
    return;
  }

  const result = await deleteComment(id);
  operationToResponse(res, result as object);
});
