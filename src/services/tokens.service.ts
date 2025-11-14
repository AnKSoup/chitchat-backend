// ### TO VALIDATE USER TOKEN ###
// AND CREATE TOKENS

import { hashSync } from "bcrypt";
import { getUser, usersToArray } from "./db/user.service.js";
import { getProperty, getSuccess, iro } from "../utils/responses.utils.js";

//Creating a token using bcrypt, its good enough:
export function createToken(email: string) {
  return hashSync(`${email}_${Date.now()}`, 5);
}

//Looks if token exists and returns the corresponding id in content.
export async function isTokenValid(token: string) {
  //Tries to fetch user_id.
  const result = await getUser(["user_id"], [`user_token = "${token}"`]);

  if (getSuccess(result as object)) {
    //If succeess returns the id.
    const content = usersToArray(result) as Array<object>;
    return iro(
      true,
      "Token valid, id found.",
      200,
      "user_id in content.",
      content[0]
    );
  } else {
    //Returns a fail
    return iro(
      false,
      "Invalid token.",
      404,
      "Couldn't find token in the db, please provide a valid token."
    );
  }
}

//Is token of user?. :Takes in the result of a token validation operation because it returns a user id.
export function isTokenOfUser(tokenResult: object, id: number) {
  if (!getSuccess(tokenResult)) {
    return tokenResult;
  }
  const result = getProperty("content", tokenResult) as unknown as object;
  //Ts needs to be sure it has a user id:
  if ("user_id" in result && result.user_id == id) {
    // Checks if the same.
    return iro(true, "Token of user.", 100, "Token matching id.");
  } else {
    return iro(false, "Unauthorized user.", 401, "Token not matching id.");
  }
}
