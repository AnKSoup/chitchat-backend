import { getProperty, getSuccess } from "../../utils/responses.utils.js";
import {
  doesCommentExist,
  doesItemExist,
} from "../validation/items.service.js";
import {
  createItem,
  deleteItem,
  getItems,
  getItemsJoin,
  updateItem,
} from "./safe_queries.service.js";

export async function getCommentById(comment_id: number) {
  return await getItems(["*"], "Comment", [`comment_id = ${comment_id}`]);
}

//Get all comments from a blog
export async function getComments(
  blog_id: number,
  limit: number,
  offset: number
) {
  return await getItemsJoin(
    ["*"],
    "Comment",
    ["user_name"],
    "User",
    "user_id",
    "user_id",
    [`blog_id = ${blog_id}`],
    undefined,
    limit,
    offset
  );
}

//Write a comment
export async function writeComment(blog_id: number, comment: object) {
  const comment_content = getProperty("comment_content", comment);
  const user_id = getProperty("user_id", comment);
  let in_response_to = getProperty("in_response_to", comment) as unknown;

  const test = await doesCommentExist(in_response_to as number);

  if (in_response_to == 0) {
    in_response_to = null;
  } else if (!getSuccess(test)) {
    return test;
  }

  const result = await createItem("Comment", {
    comment_content: comment_content,
    user_id: user_id,
    in_response_to: in_response_to,
    blog_id: blog_id,
  });
  return result;
}

//Edit a comment
export async function editComment(comment_id: number, comment: object) {
  const date = new Date();
  const comment_content = getProperty("comment_content", comment);

  const result = await updateItem(
    "Comment",
    {
      comment_content: comment_content,
      comment_modified_at: date.toISOString(),
    },
    [`comment_id = ${comment_id}`]
  );
  return result;
}

//Delete a comment
export async function deleteComment(comment_id: number) {
  return await deleteItem("Comment", [`comment_id = ${comment_id}`]);
}

//Is comment of user?
//Check for comment user_id and given id
export async function isCommentOfUser(comment_id: number, user_id: number) {
  return await doesItemExist(["comment_id"], "Comment", [
    `comment_id = ${comment_id}`,
    `user_id = ${user_id}`,
  ]);
}

export async function isCommentOfBlog(comment_id: number, blog_id: number) {
  return await doesItemExist(["comment_id"], "Comment", [
    `comment_id = ${comment_id}`,
    `blog_id = ${blog_id}`,
  ]);
}
