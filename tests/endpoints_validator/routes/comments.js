// Focuses on user testing

import { call } from "../assets/api_caller.js";
import { user1 } from "../assets/data.js";

const commentRoute = "/comment/";

// #1- Get comment from id:       GET     /comment/:comment_id
export async function GetComment(comment) {
  const testing = `Getting comment ${comment.comment_id}`;
  try {
    const result = await call("GET", commentRoute + comment.blog_id);
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Get comments from a blog:  POST    /comment/of/:blog_id    REQ: {limit, offset}
export async function GetCommentsFrom(blog) {
  const testing = `Getting comments from blog ${blog.blog_id}`;
  try {
    const result = await call("POST", commentRoute + "of/" + blog.blog_id, {
      limit: 0,
      offset: 0,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Write a comment:           POST    /comment/:blog_id       REQ: {user_id, user_token, comment_content, in_response_to}
export async function WriteComment(comment) {
  const testing = `Writing comment ${comment.comment_id}`;
  try {
    const result = await call("POST", commentRoute + comment.blog_id, {
      user_id: comment.user_id,
      user_token: user1.user_token,
      comment_content: comment.comment_content,
      in_response_to: comment.in_response_to,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #4- Edit a comment:            PUT     /comment/:comment_id    REQ: {user_id, user_token, comment_content}
export async function EditComment(comment) {
  const testing = `Editing comment ${comment.comment_id} to I have changed!!`;
  try {
    const result = await call("PUT", commentRoute + comment.comment_id, {
      user_id: comment.user_id,
      user_token: user1.user_token,
      comment_content: "I have changed!!",
    });
    comment.comment_content = "I have changed!!";
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #5- Delete a comment:          DELETE  /comment/:comment_id    REQ: {user_id, user_token, blog_id}
export async function DeleteComment(comment) {
  const testing = `Deleting comment ${comment.comment_id}`;
  try {
    const result = await call("DELETE", commentRoute + comment.comment_id, {
      user_id: comment.user_id,
      user_token: user1.user_token,
      blog_id: comment.blog_id,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
