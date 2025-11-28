//### Helps checking if an item exist in the database ###

import { getSuccess, iro } from "../../utils/responses.utils.js";
import { getItems } from "../db/safe_queries.service.js";

export async function doesItemExist(
  columns: Array<string>,
  table: string,
  conditions: Array<string>
) {
  const result = await getItems(columns, table, conditions);

  if (getSuccess(result as object)) {
    return iro(true, "Item exist.", 200, `Item exists in ${table}.`);
  } else {
    return iro(
      false,
      `${table} doesn't exist.`,
      400,
      `Please provide an existing ${table}.`
    );
  }
}

export async function doesUserExist(id: number) {
  return await doesItemExist(["user_name"], "User", [`user_id = ${id}`]);
}

export async function doesConvExist(id: number) {
  return await doesItemExist(["conversation_name"], "Conversation", [
    `conversation_id = ${id}`,
  ]);
}

export async function doesCommentExist(id: number) {
  return await doesItemExist(["user_id"], "Comment", [`comment_id = ${id}`]);
}
