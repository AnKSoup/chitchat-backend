// Handles validating credentials:

import { iro } from "../../utils/responses.utils.js";

// Email validator from W3C:
const emailValidator =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Checks if has at least 1 digit, 1 lowecase, 1 uppercase, 1 special char, no white spaces and between 8 and 20 chars.
const passwordValidator =
  /^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\W]{8,20}$/;

// Checks if email is valid
export function isEmailValid(email: string) {
  if (emailValidator.test(email)) {
    return iro(true, "Valid email", 100, "Email matched requirements.");
  } else
    return iro(false, "Invalid email.", 400, "Please provide a valid email.");
}

// Checks if password is valid
export function isPasswordValid(password: string) {
  if (passwordValidator.test(password)) {
    return iro(true, "Valid password", 100, "Password matched requirements.");
  } else
    return iro(
      false,
      "Invalid password.",
      400,
      "Ensure that the password contains the following: at least 1 digit, 1 lowecase, 1 uppercase, and 1 special character, no white spaces and between 8 and 20 characters total."
    );
}
