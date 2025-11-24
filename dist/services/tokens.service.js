// ### TO VALIDATE USER TOKEN ###
// AND CREATE TOKENS
import { hashSync } from "bcrypt";
import { getUser, usersToArray } from "./db/user.service.js";
import { getProperty, getSuccess, iro } from "../utils/responses.utils.js";
import { getOwnerId } from "./db/conversation.service.js";
//Creating a token using bcrypt, its good enough:
export function createToken(email) {
    return hashSync(`${email}_${Date.now()}`, 5);
}
//Looks if token exists and returns the corresponding id in content.
export async function isTokenValid(token) {
    //Tries to fetch user_id.
    const result = await getUser(["user_id"], [`user_token = "${token}"`]);
    if (getSuccess(result)) {
        //If success returns the id.
        const content = usersToArray(result);
        return iro(true, "Token valid, id found.", 200, "user_id in content.", content[0]);
    }
    else {
        //Returns a fail
        return iro(false, "Invalid token.", 404, "Couldn't find token in the db, please provide a valid token.");
    }
}
//Is token of user?. :Takes in the result of a token validation operation because it returns a user id.
export function isTokenOfUser(tokenResult, id) {
    if (!getSuccess(tokenResult)) {
        return tokenResult;
    }
    const result = getProperty("content", tokenResult);
    //Ts needs to be sure it has a user id:
    if ("user_id" in result && result.user_id == id) {
        // Checks if the same.
        return iro(true, "Token of user.", 100, "Token matching id.");
    }
    else {
        return iro(false, "Unauthorized user.", 401, "Token not matching id.");
    }
}
//Is owner_id == user_id :Takes in the result of a token validation operation because it returns a user id.
export async function isTokenOfOwner(tokenResult, conversation_id) {
    if (!getSuccess(tokenResult)) {
        return tokenResult;
    }
    //Gets owner of the conversation
    const id = (await getOwnerId(conversation_id));
    //Returns an array of object => need to take the fist element of this array.
    const owner = getProperty("content", id);
    let owner_obj;
    if (owner) {
        owner_obj = owner[0];
    }
    else {
        return id;
    }
    const user = getProperty("content", tokenResult);
    if (getSuccess(id) &&
        "owner_id" in owner_obj &&
        "user_id" in user &&
        owner_obj.owner_id == user.user_id) {
        return iro(true, "Token is of owner.", 100, "Ids are matching.");
    }
    else {
        return iro(false, "Unauthorized user.", 401, "Token not of owner.");
    }
}
//# sourceMappingURL=tokens.service.js.map