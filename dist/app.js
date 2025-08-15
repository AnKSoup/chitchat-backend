"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
require("dotenv").config();
// Init app :
const app = Express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map