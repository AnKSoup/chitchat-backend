import Express from "express";
import { urlencoded } from "express";
import "dotenv/config";

//Routers:
import { routeUser } from "./routes/user.route.js";
// import { response } from "./utils/responses.utils.js";
// import { opertationToResponse } from "./services/validation/operations.service.js";
// import { routeConversation } from "./routes/converstation.js";

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
app.use("/user", routeUser);
// app.use("/conversation", routeConversation);

// //General Error handler: (Prevents any crash.)
// // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
// app.use((err: any, req: any, res: any, next: any) => {
//   const result = iro(false, "Error occured.", 500, err.message);
//   opertationToResponse(res, result);
// });
