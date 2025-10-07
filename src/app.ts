import Express = require("express");
import 'dotenv/config';

// Init app:
const app = Express();
const port = process.env.PORT;

// // ############## to move

// import sqlite3 from 'sqlite3'
// import { open } from 'sqlite'




// const query = `
// PRAGMA key = ${dbPass};
// SELECT * FROM User;
// `;

// const query2 = `
// SELECT * FROM User;
// `;



// const dbPromise = open({
//     filename: rootPath + dbPath,
//     driver: sqlite3.Database
// })

// const getSmth = async (query: string) => {
//     const db = await dbPromise; //connect
//     const result = await db.all(query);

// };
// getSmth('SELECT * FROM User');

// // ##############

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('eloo chitchat')
});
