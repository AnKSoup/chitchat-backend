// Try catches queries and return iros for easier implementation:

import { getProperty, iro } from "../../utils/responses.utils.js";
import { dbDelete, dbInsert, dbSelect, dbUpdate } from "./queries.service.js";

// Get Item(s).
export async function getItems(
  columns: Array<string>,
  table: string,
  conditions?: Array<string>,
  limit?: number
) {
  try {
    return await dbSelect(columns, table, conditions, limit);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return iro(
      false,
      `No ${table}(s) found.`,
      400,
      `No ${table}(s) corresponding to query.`
    );
  }
}

// Creates an item with a JSON.
export async function createItem(table: string, item: object) {
  try {
    await dbInsert(table, item);
    return iro(
      true,
      `${table} created.`,
      201,
      `${table} successfully created.`
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
    return iro(true, `${table} delete.`, 201, `${table} successfully delete.`);
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
