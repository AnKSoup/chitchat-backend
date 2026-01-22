// Focuses on user testing

import { call } from "../assets/api_caller.js";

// #1- Generate keys:      GET       /encryption/key_pairs
export async function GenerateKeys() {
  const testing = `Generating keys`;
  try {
    const result = await call("GET", "/encryption/key_pairs");
    return { Testing: testing, ...result };
  } catch (error) {
    return { Testing: testing, error: error.message };
  }
}
