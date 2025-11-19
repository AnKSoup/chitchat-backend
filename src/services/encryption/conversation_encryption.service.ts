//### Handles the logic for hybrid encryption: ###
import crypto from "crypto";
import { getProperty, iro } from "../../utils/responses.utils.js";

// ## SYMMETRIC LOGIC
// Uses the built in crypto module from node and the AES-256-GCM algorithm.
// Key is stored with asymmetric encryption in the G_roup_Member table

// Tries to create a key and an iv.
export function createKeyAndIV() {
  try {
    //Buffers as strings for easier storage
    const key = crypto.randomBytes(32).toString("base64");
    const iv = crypto.randomBytes(16).toString("base64");

    return iro(
      true,
      "Key and IV created successfully.",
      201,
      "Key and IV in content.",
      { key: key, iv: iv }
    );
  } catch (error) {
    const message = getProperty(
      "message",
      error as object
    ) as unknown as string;
    return iro(false, "Couldn't create key.", 500, message);
  }
}

//encrypts a message and retrieve its tag.
export function encrypt(message: string, key: string, iv: string) {
  try {
    //Converts base64 strings into buffers
    const keyBuffer = Buffer.from(key, "base64");
    const ivBuffer = Buffer.from(iv, "base64");
    //Encrypts the message.
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, ivBuffer);
    let result = cipher.update(message, "utf-8", "hex");
    result += cipher.final("hex");

    //Is needed for auth inside decryption.
    const tag = cipher.getAuthTag().toString("base64");

    return iro(
      true,
      "Message encrypted successfully.",
      200,
      "Message and tag in content.",
      { message: result, tag: tag }
    );
  } catch (error) {
    //TODO ADD CHECKS TO KNOW IF ISSUE IS FROM THE KEY OR THE IV
    const message = getProperty(
      "message",
      error as object
    ) as unknown as string;
    return iro(false, "Couldn't encrypt the message.", 500, message);
  }
}

export function decrypt(message: string, key: string, iv: string, tag: string) {
  try {
    //Converts base64 strings into buffers
    const keyBuffer = Buffer.from(key, "base64");
    const ivBuffer = Buffer.from(iv, "base64");
    const tagBuffer = Buffer.from(tag, "base64");

    //Decrypts the message.
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      keyBuffer,
      ivBuffer
    );

    decipher.setAuthTag(tagBuffer);
    let result = decipher.update(message, "hex", "utf-8");
    result += decipher.final("utf-8");

    return iro(
      true,
      "Message decrypted successfully.",
      200,
      "Message in content.",
      { message: result }
    );
  } catch (error) {
    //TODO ADD CHECKS TO KNOW IF ISSUE IS FROM THE KEY OR THE IV
    const message = getProperty(
      "message",
      error as object
    ) as unknown as string;
    return iro(false, "Couldn't encrypt the message.", 500, message);
  }
}
