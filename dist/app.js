import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const Express = __require("express");
import { urlencoded } from "express";
import 'dotenv/config';
//Routers:
import { routeUser } from "./routes/user.js";
// Init app:
const app = Express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`Server listening at ${host}:${port}`);
});
//Middlewares;
app.use(urlencoded({ extended: true })); //To get infos from forms.
//Routers:
app.use('/user', routeUser);
//# sourceMappingURL=app.js.map