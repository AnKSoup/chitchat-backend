import { emailToPassword } from "../db/user.service.js";
import { getProperty, getSuccess, iro } from "../../utils/responses.utils.js";
import { compareSync, hashSync } from "bcrypt";
//Encrypts password:
export function encryptPassword(password) {
    return hashSync(password, 12);
}
//Decrypts password:
export function isPasswordCorrect(data, encrypted) {
    return compareSync(data, encrypted);
}
export async function validateUserPassword(user) {
    const result = await emailToPassword(user);
    //Checks for success:
    if (getSuccess(result) && "user_password" in user) {
        const existingUser = getProperty("content", result);
        //Checks if passwords match:
        if (existingUser &&
            "user_password" in existingUser &&
            isPasswordCorrect(user.user_password, existingUser.user_password)) {
            return iro(true, "Passwords matching.", 100, "Given password matched database.");
        }
        else {
            return iro(false, "Couldn't validate password.", 400, "Passwords did not match.");
        }
    }
    else
        return result; //Already formatted
}
//# sourceMappingURL=bcrypt.service.js.map