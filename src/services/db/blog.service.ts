//Handle blog operation

import { doesItemExist } from "../validation/items.service.js";
import { createItem, getItems, updateItem } from "./safe_queries.service.js";

//Get
export async function getBlog(blog_id: number) {
  return await getItems(["*"], "Blog", [`blog_id = ${blog_id}`]);
}
//Create
export async function createBlog(blog_id: number) {
  return await createItem("Blog", { blog_id: blog_id });
}
//Update
export async function updateBlog(blog_id: number, blog_content: string) {
  const date = new Date();
  return await updateItem(
    "Blog",
    {
      blog_modified_at: date.toISOString(),
      blog_content: blog_content,
    },
    [`blog_id = ${blog_id}`]
  );
  //
}

export async function doesBlogExist(id: number) {
  return await doesItemExist(["blog_modified_at"], "Blog", [`blog_id = ${id}`]);
}
