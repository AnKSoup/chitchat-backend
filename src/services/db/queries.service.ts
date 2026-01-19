// ### Handles basic db operations: ###

// NOTE:  Preparing every statements even if seemed unnecessary prevents any forms of injection:
//        any queries to replace "?" will transform to a string,
//        anything added with a "; query.." dynamically will be ignored.

// IMPORTANT: USE AWAIT! Every operation returns a promise.

import sqlite3 from "@journeyapps/sqlcipher";
import "dotenv/config";
import path from "path";
import { iro } from "../../utils/responses.utils.js";

const rootPath = path.resolve("./");
const dbPath = rootPath + process.env.DB_PATH;
const dbPass = process.env.DB_PASS;

//Connect to db:
function dbOpen() {
  return new sqlite3.Database(dbPath);
}

//Gives it the password:
async function dbUnlock(db: sqlite3.Database) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const stmt = db.prepare(`PRAGMA key = ${dbPass}`);
      stmt.run((err) => {
        if (err) {
          reject(
            iro(false, "Couldn't connect to the database.", 500, err.message)
          );
        } else {
          resolve(
            iro(true, "Connected to database.", 100, "Password is correct.")
          );
        }
      });
      stmt.finalize();
    });
  });
}

// Executes a prepared run statement.
async function dbRun(
  query: string,
  object: object | undefined,
  message_success: string
) {
  //Connect to db:
  const db = dbOpen();
  try {
    await dbUnlock(db);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return iro(false, "Couldn't open database.", 500, error.message);
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Creates a prepared statement to prevent injection.
      const stmt = db.prepare(query, (err) => {
        if (err) {
          reject(iro(false, "Couldn't prepare query.", 500, err.message));
        }
      });
      // Executes the statement with an array of values if it exists.
      let arr = undefined;
      if (object) {
        arr = Object.values(object);
      }
      stmt.run(arr, function (err) {
        //Rejects if error, else resolves.
        if (err) {
          reject(iro(false, "Couldn't execute query.", 500, err.message));
        } else {
          resolve(
            iro(true, "Query executed.", 100, message_success, {
              rowid: this.lastID,
            })
          );
        }
      });
      stmt.finalize();
      //Close the db connection.
      db.close();
    });
  });
}

//Looks similar to dbRun() but executes all() instead of run().
async function dbAll(query: string) {
  //Connect to db:
  const db = dbOpen();
  try {
    await dbUnlock(db);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return iro(false, "Couldn't open database.", 500, error.message);
  }

  // Creates a promise thats resolves when data is retrieved from the db.
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Creates a prepared statement to prevent injection.
      const stmt = db.prepare(query, (err) => {
        if (err) {
          reject(iro(false, "Couldn't prepare query.", 500, err.message));
        }
      });
      // Executes the statement;
      stmt.all(function (err, row) {
        //Rejects if error, else resolves.
        if (err) {
          reject(iro(false, "Couldn't execute query.", 500, err.message));
        } else if (row.length == 0) {
          reject(iro(false, "Empty result.", 400, "Query returned nothing."));
        } else {
          resolve(iro(true, "Data retrieved.", 200, "Data in content.", row));
        }
      });
      stmt.finalize();
      //Close the db connection.
      db.close();
    });
  });
}

//SELECT: await dbSelect()
export async function dbSelect(
  columns: Array<string>,
  table: string,
  conditions?: Array<string>,
  invert?: string,
  limit?: number,
  offset?: number
) {
  // Formats the query as SELECT (...) FROM ... WHERE ... AND ... LIMIT ...;
  let query = `SELECT ${columns.join(", ")} FROM ${table}`;
  if (conditions) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  if (invert) {
    query += ` ORDER BY ${invert} DESC`;
  }
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  query += ";";

  return await dbAll(query);
}

//SELECT WITH JOIN: await dbSelectJoin()
export async function dbSelectJoin(
  columns1: Array<string>,
  table1: string,
  columns2: Array<string>,
  table2: string,
  join1: string,
  join2: string,
  conditions?: Array<string>,
  invert?: string,
  limit?: number,
  offset?: number
) {
  // Formats the query as SELECT (table.column ...) FROM ... JOIN ... ON ...=... WHERE ... AND ... LIMIT ...;
  let query = `SELECT ${columns1
    .map((item) => `${table1}.${item}`)
    .join(", ")}, ${columns2
    .map((item) => `${table2}.${item}`)
    .join(
      ", "
    )} FROM ${table1} JOIN ${table2} ON ${table1}.${join1} = ${table2}.${join2}`;
  if (conditions) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  if (invert) {
    query += ` ORDER BY ${invert} DESC`;
  }
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  query += ";";

  return await dbAll(query);
}

//INSERT: await dbInsert()
export async function dbInsert(table: string, object: object) {
  // Formats the query as INSERT INTO ... (..., ...) VALUES (?, ?..);
  let query = `INSERT INTO ${table} (${Object.keys(object).join(", ")}) VALUES (`; // prettier-ignore

  for (let i = 0; i < Object.keys(object).length; i++) {
    if (i < Object.keys(object).length - 1) {
      query += "?, ";
    } else {
      query += "?);";
    }
  }

  return await dbRun(
    query,
    object,
    `Operation successful: added object to ${table}.`
  );
}

// UPDATE: await dbUpdate()
export async function dbUpdate(
  table: string,
  object: object,
  conditions: Array<string>
) {
  // Formats the query as UPDATE ... SET ... = ?, ... WHERE ... AND ...;
  let query = `UPDATE ${table} SET `;

  for (let i = 0; i < Object.keys(object).length; i++) {
    if (i < Object.keys(object).length - 1) {
      query += `${Object.keys(object)[i]} = ?, `;
    } else {
      query += `${Object.keys(object)[i]} = ? WHERE ${conditions.join(
        " AND "
      )};`;
    }
  }

  return await dbRun(
    query,
    object,
    `Operation successful: updated object to ${table}.`
  );
}

// DELETE:
export async function dbDelete(table: string, conditions: Array<string>) {
  const query = ` DELETE FROM ${table} WHERE ${conditions.join(" AND ")};`;
  return await dbRun(
    query,
    undefined,
    `Operation successful: deleted object from ${table}.`
  );
}
