//Performs encryption/decryption for the client to use

import { Router } from "express";
import {
  createPair,
  decryptKey,
  decryptMessage,
  encryptKey,
  encryptMessage,
} from "../services/encryption/conversation_encryption.service.js";
import {
  operationToResponse,
  validateOperation,
} from "../services/validation/operations.service.js";
import { allowOnly } from "../services/validation/params.service.js";

export const routeEncryption = Router();

//GET /key_pairs
routeEncryption.get("/key_pairs", (req, res) => {
  const result = createPair();
  operationToResponse(res, result as object);
});

//IMPORTANT! After further testing those bellow work client side fortunately.bah j'ai vu que

//POST encrypt/message
routeEncryption.post("/encrypt/message", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["message", "key", "iv"]);
  if (validateOperation(res, params)) return;

  const result = encryptMessage(body.message, body.key, body.iv);
  operationToResponse(res, result);
});

//POST decrypt/message
routeEncryption.post("/decrypt/message", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["encrypted_message", "key", "iv", "tag"]);
  if (validateOperation(res, params)) return;

  const result = decryptMessage(body.message, body.key, body.iv, body.tag);
  operationToResponse(res, result);
});

//POST encrypt/key
routeEncryption.post("/encrypt/key", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["public_key", "key"]);
  if (validateOperation(res, params)) return;

  const result = encryptKey(body.public_key, body.key);
  operationToResponse(res, result);
});

//POST decrypt/key
routeEncryption.post("/c", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["private_key", "encrypted_key"]);
  if (validateOperation(res, params)) return;

  const result = decryptKey(body.private_key, body.encrypted_key);
  operationToResponse(res, result);
});

//POST encrypt/iv
routeEncryption.post("/encrypt/iv", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["public_key", "iv"]);
  if (validateOperation(res, params)) return;

  const result = encryptKey(body.public_key, body.iv);
  operationToResponse(res, result);
});

//POST decrypt/iv
routeEncryption.post("/decrypt/iv", (req, res) => {
  const body = req.body;

  const params = allowOnly(body, ["private_key", "encrypted_iv"]);
  if (validateOperation(res, params)) return;

  const result = decryptKey(body.private_key, body.encrypted_iv);
  operationToResponse(res, result);
});
