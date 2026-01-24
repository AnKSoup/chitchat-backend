import Express from "express";
import { urlencoded } from "express";
import "dotenv/config";

import cors from "cors";

//Routers:
import { routeUser } from "./routes/user.route.js";
import { routeConversation } from "./routes/conversation.route.js";
import { routeGroupMember } from "./routes/group_member.route.js";
import { routeMessage } from "./routes/message.route.js";
import { routeEncryption } from "./routes/encryption.route.js";
import { routeBlog } from "./routes/blog.route.js";
import { routeComment } from "./routes/comment.route.js";

import { operationToResponse } from "./services/validation/operations.service.js";
import { iro } from "./utils/responses.utils.js";

// Init app:
const app = Express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server listening at ${host}:${port}`);
});

//Middlewares;
app.use(urlencoded({ extended: true })); //To get infos from forms.
app.use(Express.json()); //To enable json

app.use(cors()); //Clients from chromium wouldn't work without this one.

//General Error handler: (Prevents any crash.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err: any, req: any, res: any, next: any) => {
  const result = iro(false, "Error occurred.", 500, err.message);
  operationToResponse(res, result);
});

//Routers:
app.use("/user", routeUser);
app.use("/conversation", routeConversation);
app.use("/group_member", routeGroupMember);
app.use("/message", routeMessage);
app.use("/blog", routeBlog);
app.use("/comment", routeComment);

//Utils routers
app.use("/encryption", routeEncryption); //Because some encryption needed to be executed in a backend environment
