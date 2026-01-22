// Focuses on user testing

import { call } from "../assets/api_caller.js";
import { blog1, user1 } from "../assets/data.js";

const blogRoute = "/blog/";

// #1- Get a blog:      GET     /blog/:blog_id
export async function GetBlog1() {
  const testing = `Getting blog of ${user1.user_name}`;
  try {
    const result = await call("GET", blogRoute + blog1.blog_id);
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #2- Create a blog:   POST    /blog/:blog_id  REQ: {user_token}
export async function CreateBlog1() {
  const testing = `Creating blog of ${user1.user_name}`;
  try {
    const result = await call("POST", blogRoute + blog1.blog_id, {
      user_token: user1.user_token,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}

// #3- Edit a blog:     PUT     /blog/:blog_id  REQ: {user_token, blog_content}
export async function EditBlog1() {
  const testing = `Updating blog of ${user1.user_name}`;
  try {
    const result = await call("PUT", blogRoute + blog1.blog_id, {
      user_token: user1.user_token,
      blog_content: blog1.blog_content,
    });
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
