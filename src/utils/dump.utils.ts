// this is for testing

import { getItems, itemsToArray } from "../services/db/safe_queries.service.js";

export async function dbDump() {
  const user = await getItems(["*"], "User");
  const conv = await getItems(["*"], "Conversation");
  const gm = await getItems(["*"], "Group_Member");
  const mess = await getItems(["*"], "Message");
  const blog = await getItems(["*"], "Blog");
  const comm = await getItems(["*"], "Comment");

  return {
    Users: itemsToArray(user),
    Conversations: itemsToArray(conv),
    Group_Members: itemsToArray(gm),
    Messages: itemsToArray(mess),
    Blogs: itemsToArray(blog),
    Comments: itemsToArray(comm),
  };
}
