//### Handles communication with the user table ###
// ## IMPORTS ##
import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import {
  encryptPassword,
  isPasswordCorrect,
  validateUserPassword,
} from "../encryption/bcrypt.service.js";
import { createToken } from "../tokens.service.js";
import {
  createItem,
  deleteItem,
  getItems,
  itemsToArray,
  updateItem,
} from "./safe_queries.service.js";

// ## CRUD: ##
// Delete later only there for backward compatibility
// PLEASE WORK ON THIS BECAUSE THIS IS SO UGLY

// Get User(s).
export async function getUser(
  columns: Array<string>,
  conditions?: Array<string>,
  limit?: number
) {
  return await getItems(columns, "User", conditions, undefined, limit);
}

// Creates a user with a JSON.
export async function createUser(user: object) {
  const result = await createItem("User", user);
  const message = getProperty("detail", result) as unknown as string;
  if (message.includes("UNIQUE constraint failed: User.user_email")) {
    return iro(false, "Couldn't create user.", 400, "Email already in use.");
  }
  return result;
}

// Updates user(s) with a JSON and conditions.
export async function updateUser(user: object, conditions: Array<string>) {
  return await updateItem("User", user, conditions);
}

// Deletes user(s) with conditions.
export async function deleteUser(conditions: Array<string>) {
  return await deleteItem("User", conditions);
}

// ## Data Utils: ##

//Use this to convert a "getUser" in an array of users
export function usersToArray(result: unknown) {
  return itemsToArray(result);
}

//if user exists returns password
export async function emailToPassword(user: object) {
  //Gets user.
  if ("user_email" in user) {
    const result = await getUser(
      ["user_password"],
      [`user_email = "${user.user_email}"`]
    );

    //If exists returns password
    if (getSuccess(result as object)) {
      const content = usersToArray(result) as Array<object>;
      return iro(
        true,
        "User exists",
        100,
        "User password in content.",
        content[0]
      );
    } else {
      return iro(
        false,
        "Couldn't log in.",
        400,
        "User with this email doesn't exist."
      );
    }
  } else {
    return iro(false, "Couldn't log in.", 500, "Something went wrong."); // This shouldn't occur.
  }
}

// This gets a password using an id
async function idToPassword(id: number) {
  const password = await getUser(["user_password"], [`user_id = ${id}`]);
  if (getSuccess(password as object)) {
    const content = getProperty(
      "content",
      password as object
    ) as unknown as Array<object>;
    if (content[0] && "user_password" in content[0]) {
      return iro(
        true,
        "Password retrieved.",
        100,
        "Password in content.",
        content[0]
      );
    }
  } else {
    return iro(
      false,
      "No such user.",
      400,
      "Id provided doesn't exist in database."
    );
  }
}

// ## Logic: ##

//Attempts to Sign in a user:
export async function signinUser(user: object) {
  // Needed for typescript.
  if ("user_name" in user && "user_email" in user && "user_password" in user) {
    const result = await createUser({
      user_name: user.user_name,
      user_email: user.user_email,
      user_password: encryptPassword(user.user_password as string),
    });
    return result;
  } else {
    return iro(false, "Couldn't Sign in.", 500, "Something went wrong."); // This shouldn't occur.
  }
}

//Attempts to log in a user:
export async function loginUser(user: object) {
  const password = await validateUserPassword(user);
  // Checks if good password:
  if (getSuccess(password) && "user_email" in user) {
    //Creates token:
    const token = createToken(user.user_email as string);
    //Tries to update it in the db:
    const result = await updateUser({ user_token: token }, [
      `user_email = "${user.user_email}"`,
    ]);
    //If success sends back the token to the client:
    if (getSuccess(result)) {
      return iro(
        true,
        "Logged user in successfully.",
        200,
        "Token in content.",
        { user_token: token }
      );
    } else {
      return result;
    }
  } else {
    return password;
  }
}

//Attempts to log out a user:
export async function logoutUser(tokenResult: object) {
  //Validate then pass in the result of the token operation.

  const id = getProperty("content", tokenResult) as unknown as object;
  //Ts needs to be sure it has a user id:
  if ("user_id" in id) {
    //Tries to delete token
    const result = await updateUser({ user_token: null }, [
      `user_id = ${id.user_id}`,
    ]);
    if (getSuccess(result)) {
      return iro(
        true,
        "Logged user out successfully.",
        200,
        "Token has been removed."
      );
    } else {
      return result;
    }
  } else {
    return iro(false, "Invalid id.", 500, "Retrieved id was invalid."); // Shouldn't occur.
  }
}

export async function getUserById(user_id: number) {
  return await getItems(["user_name"], "User", [`user_id = ${user_id}`]);
}

export async function getUserByName(user_name: string) {
  const result = await getUser(
    ["user_id, user_name"],
    [`user_name LIKE '%${user_name}%'`]
  );

  if (getSuccess(result as object)) {
    const users = usersToArray(result);
    return iro(true, "Users found.", 200, "Users in content.", users);
  } else {
    return result;
  }
}

//Tries to edit user
export async function editUser(user: object, id: number) {
  const result = await updateUser(user, [`user_id = ${id}`]);
  return result;
}

//Tries to remove user
export async function removeUser(id: number) {
  const result = await deleteUser([`user_id = ${id}`]);
  return result;
}

//Attempts to update a password
async function updatePassword(newPass: string, id: number) {
  // Encrypts and updates a given password
  const encrypted = encryptPassword(newPass);
  const update = await updateUser(
    { user_password: encrypted, user_token: null },
    [`user_id = ${id}`]
  );
  if (getSuccess(update)) {
    return iro(
      true,
      "Password successfully changed.",
      201,
      "Successfully changed to new password please log back in."
    );
  } else {
    return update;
  }
}

//Changing password logic
export async function changeUserPassword(object: object, id: number) {
  // Step 1 : get old password
  const password = await idToPassword(id);

  if (getSuccess(password as object)) {
    const content = getProperty(
      "content",
      password as object
    ) as unknown as object;

    // Step 2 : Check if same password
    if ("user_password" in content && "user_password" in object) {
      const oldPass = content.user_password as string;
      const newPass = object.user_password as string;
      if (isPasswordCorrect(newPass, oldPass)) {
        return iro(
          false,
          "Same passwords.",
          400,
          "New and old password must be different."
        );
      } else {
        // Step 3 Update pass
        const result = await updatePassword(newPass, id);
        return result;
      }
    } else {
      return iro(
        false,
        "Invalid parameters.",
        400,
        "Please provide both password."
      );
    }
  } else {
    return password;
  }
}
