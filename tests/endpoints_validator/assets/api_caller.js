//This is to call the api!

import process from "node:process";
import console from "node:console";

process.loadEnvFile(".env");

const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

const SERVER_ADDRESS = `${host}:${port}`;

export async function call(method, url, body) {
  console.log(`Calling: ${method} - ${SERVER_ADDRESS + url}`);

  //Gather options:
  const params = {
    method: method,
    headers: {
      // This is needed for the express app to accept the request
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  //Send a request
  const response = await fetch(SERVER_ADDRESS + url, params);
  const result = await response.json();

  if (result.success) {
    console.log("SUCCEEDED!\n");
  } else {
    console.log("FAILED!\n");
  }
  return await result;
}
