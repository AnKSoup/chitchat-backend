// This is just a js script to test each endpoints of the ChitChat API: it'll generate a log of each responses!
import { writeFileSync } from "node:fs";
import { FormatResponses } from "./assets/result_formatter.js";
import console from "node:console";
import path from "path";

const resultFile = path.resolve() + "/tests/endpoints_validator/result.txt";
const result = await FormatResponses();

try {
  writeFileSync(resultFile, result);
  // file written successfully
} catch (err) {
  console.error(err);
}

console.log("Done!");
console.log(`Check file://${resultFile} for details`);
