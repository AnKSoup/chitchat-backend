//### Handles communication with the Group_Member table ###

import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { doesItemExist } from "../validation/items.service.js";
import { isNotNull } from "../validation/params.service.js";
import {
  createItem,
  getItems,
  getItemsJoin,
  updateItem,
} from "./safe_queries.service.js";

//Attempts to join chat
export async function joinChat(object: object) {
  const check = isNotNull(object, [
    "user_id",
    "conversation_id",
    "decrypt_key",
    "decrypt_iv",
  ]);
  if (!getSuccess(check)) {
    return check;
  }

  const user_id = getProperty("user_id", object);
  const conversation_id = getProperty("conversation_id", object);
  const decrypt_key = getProperty("decrypt_key", object);
  const decrypt_iv = getProperty("decrypt_iv", object);

  const result = await createItem("Group_Member", {
    user_id: user_id,
    conversation_id: conversation_id,
    decrypt_key: decrypt_key,
    decrypt_iv: decrypt_iv,
  });
  return result;
}

//then rejoin chat if member left and you want them back in
export async function rejoinChat(object: object, conversation_id: number) {
  const check = isNotNull(object, ["user_id", "decrypt_key", "decrypt_iv"]);
  if (!getSuccess(check)) {
    return check;
  }

  const date = new Date();

  const user_id = getProperty("user_id", object);
  const decrypt_key = getProperty("decrypt_key", object);
  const decrypt_iv = getProperty("decrypt_iv", object);

  const result = await updateItem(
    "Group_Member",
    {
      decrypt_key: decrypt_key,
      decrypt_iv: decrypt_iv,
      left_at: null,
      joined_at: date.toISOString(),
    },
    [`user_id = ${user_id}`, `conversation_id = ${conversation_id}`]
  );
  return result;
}

//Attempts to leave chat
export async function leaveChat(object: object, conversation_id: number) {
  const date = new Date();
  //make him left and then delete iv and key
  const user_id = getProperty("user_id", object);

  const result = await updateItem(
    "Group_Member",
    {
      decrypt_key: null,
      decrypt_iv: null,
      left_at: date.toISOString(),
    },
    [`user_id = ${user_id}`, `conversation_id = ${conversation_id}`]
  );
  return result;
}

// Easier check: checks if member exists then rejoin if really wants to:
export async function isSafeToCreate(object: object) {
  const conversation_id = getProperty("conversation_id", object);
  const user_id = getProperty("user_id", object);

  const result = await doesItemExist(["joined_at"], "Group_Member", [
    `user_id = ${user_id}`,
    `conversation_id = ${conversation_id}`,
  ]);
  if (getSuccess(result)) {
    return iro(
      false,
      "Member already exists.",
      403,
      "Member already exists, cannot create."
    );
  } else {
    return iro(true, "Member doesn't exist.", 100, "Member is safe to create.");
  }
}

export async function isMemberInConv(user_id: number, conversation_id: number) {
  //gets the conv and checks if user didn't leave with id
  const result = await getItems(["joined_at"], "Group_Member", [
    `user_id = ${user_id}`,
    `conversation_id = ${conversation_id}`,
  ]);
  if (getSuccess(result as object)) {
    const content = getProperty(
      "content",
      result as object
    ) as unknown as Array<object>;
    const object = content[0];
    if (object && "joined_at" in object && object.joined_at) {
      return iro(
        true,
        "Member in conv.",
        100,
        "Member is present in conversation."
      );
    } else {
      return iro(
        false,
        "Member left.",
        400,
        "Member not in conversation anymore."
      );
    }
  } else {
    return result;
  }
}

export async function getAllConvsOfUser(user_id: number) {
  //Get conv id where user = user_ids
  return await getItemsJoin(
    ["conversation_id"],
    "Group_Member",
    ["conversation_name"],
    "Conversation",
    "conversation_id",
    "conversation_id",
    [`Group_Member.user_id = ${user_id}`]
  );
}
