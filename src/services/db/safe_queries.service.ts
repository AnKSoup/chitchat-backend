// Try catches queries and return iros for easier implementation:

import { getProperty, iro } from "../../utils/responses.utils.js";
import {
  dbDelete,
  dbInsert,
  dbSelect,
  dbSelectJoin,
  dbUpdate,
} from "./queries.service.js";

// Get Item(s).
export async function getItems(
  columns: Array<string>,
  table: string,
  conditions?: Array<string>,
  invert?: string,
  limit?: number,
  offset?: number
) {
  try {
    return await dbSelect(columns, table, conditions, invert, limit, offset);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return iro(
      false,
      `No ${table}(s) found.`,
      404,
      `No ${table}(s) corresponding to query.`
    );
  }
}

export async function getItemsJoin(
  columns1: Array<string>,
  table1: string,
  columns2: Array<string>,
  table2: string,
  join1: string,
  join2: string,
  conditions?: Array<string>,
  invert?: string,
  limit?: number,
  offset?: number
) {
  try {
    return await dbSelectJoin(
      columns1,
      table1,
      columns2,
      table2,
      join1,
      join2,
      conditions,
      invert,
      limit,
      offset
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return iro(
      false,
      `No ${table1}(s) or ${table2}(s) found.`,
      404,
      `No ${table1}(s) or ${table2}(s) corresponding to query.`
    );
  }
}

// Creates an item with a JSON.
export async function createItem(table: string, item: object) {
  try {
    const result = await dbInsert(table, item);
    //This is to return its id => needed by the client sometimes.
    const lastID = getProperty("content", result as object);
    return iro(
      true,
      `${table} created.`,
      201,
      `${table} successfully created.`,
      lastID as unknown as object
    );
  } catch (error) {
    const detail = getProperty("detail", error as object) as unknown as string; //Dont worry typescript it's not null..
    return iro(false, `Couldn't create ${table}.`, 500, detail);
  }
}

// Updates item(s) with a JSON and conditions.
export async function updateItem(
  table: string,
  item: object,
  conditions: Array<string>
) {
  try {
    await dbUpdate(table, item, conditions);
    return iro(
      true,
      `${table} updated.`,
      201,
      `${table} successfully updated.`
    );
  } catch (error) {
    const detail = getProperty("detail", error as object) as unknown as string; //Dont worry typescript it's not null..
    return iro(false, `Couldn't update ${table}.`, 500, detail);
  }
}

// Deletes item(s) with conditions.
export async function deleteItem(table: string, conditions: Array<string>) {
  try {
    await dbDelete(table, conditions);
    return iro(
      true,
      `${table} deleted.`,
      201,
      `${table} successfully deleted.`
    );
  } catch (error) {
    const detail = getProperty("detail", error as object) as unknown as string; //Dont worry typescript it's not null..
    return iro(false, `Couldn't delete ${table}.`, 500, detail);
  }
}

//Use this to convert a "getItem" in an array of item
export function itemsToArray(result: unknown) {
  if (typeof result === "object" && result != null) {
    const arr: Array<object> = getProperty(
      "content",
      result
    ) as unknown as Array<object>; //Gets rid of the type "never[]"
    return arr;
  }
}
