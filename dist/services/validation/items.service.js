//### Helps checking if an item exist in the database ###
import { getSuccess, iro } from "../../utils/responses.utils.js";
import { getItems } from "../db/safe_queries.service.js";
export async function doesItemExist(columns, table, conditions) {
    const result = await getItems(columns, table, conditions);
    if (getSuccess(result)) {
        return iro(true, "Item exist.", 200, `Item exists in ${table}.`);
    }
    else {
        return iro(false, `${table} doesn't exist.`, 400, `Please provide an existing ${table}.`);
    }
}
export async function doesUserExist(id) {
    return await doesItemExist(["user_name"], "User", [`user_id = ${id}`]);
}
//# sourceMappingURL=items.service.js.map