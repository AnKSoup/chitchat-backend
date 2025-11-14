import { emailToPassword } from "../db/user.service.js";
import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { compareSync, hashSync } from "bcrypt";

//Encrypts password:
export function encryptPassword(password: string) {
  return hashSync(password, 12);
}

//Decrypts password:
export function isPasswordCorrect(data: string, encrypted: string) {
  return compareSync(data, encrypted);
}

export async function validateUserPassword(user: object) {
  const result = await emailToPassword(user);
  //Checks for success:
  if (getSuccess(result) && "user_password" in user) {
    const existingUser = getProperty("content", result) as unknown as object;
    //Checks if passwords match:
    if (
      existingUser &&
      "user_password" in existingUser &&
      isPasswordCorrect(
        user.user_password as string,
        existingUser.user_password as string
      )
    ) {
      return iro(
        true,
        "Passwords matching.",
        100,
        "Given password matched database."
      );
    } else {
      return iro(
        false,
        "Couldn't validate password.",
        400,
        "Passwords did not match."
      );
    }
  } else return result; //Already formated
}

//encryption logic for conversations will go here ?
