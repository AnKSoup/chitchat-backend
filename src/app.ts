import Express from "express";
import { urlencoded } from "express";
import "dotenv/config";

//Routers:
import { routeUser } from "./routes/user.route.js";
import { routeConversation } from "./routes/conversation.route.js";
import { routeGroupMember } from "./routes/group_member.route.js";
import { routeMessage } from "./routes/message.route.js";
import { routeEncryption } from "./routes/encryption.route.js";
// import { response } from "./utils/responses.utils.js";
// import { operationToResponse } from "./services/validation/operations.service.js";

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
app.use("/conversation", routeConversation);
app.use("/group_member", routeGroupMember);
app.use("/message", routeMessage);

//Utils routers
app.use("/encryption", routeEncryption); //Because encryption needed to be executed in a backend environment

// //General Error handler: (Prevents any crash.)
// // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
// app.use((err: any, req: any, res: any, next: any) => {
//   const result = iro(false, "Error occurred.", 500, err.message);
//   operationToResponse(res, result);
// });

// #ENDPOINTS (delete later, is for easier testing)
console.log(
  `
  ### LIST OF ENDPOINTS: ###

  1) USER :
    #1- Sign in:    POST    /user/                
    #2- Log in:     POST    /user/login           
    #3- Log out:    POST    /user/logout
    #4- Get by id:  GET     /user/:id          
    #5- Update:     PUT     /user/:id             
    #6- Delete:     DELETE  /user/:id             
    #7- Get id:     POST    /user/get_id          
    #8- Get b name: GET     /user/search/:username
    #9- Chang pass: PUT     /user/change_pass/:id 

  2) CONVERSATION :
    #1- Get conv:      GET     /conversation/:id 
    #2- Create conv:   POST    /conversation/    
    #3- Update conv:   PUT     /conversation/:id 
    #4- Delete conv:   DELETE  /conversation/:id 
    #5- All members:   GET     /conversation/members_of/:conversation_id  

  3) GROUP MEMBERS :
    #1- Join Chat:   POST  /group_member/                        
    #2- Rejoin Chat: PUT   /group_member/rejoin/:conversation_id 
    #3- Leave chat:  PUT   /group_member/leave/:conversation_id  
    #4- All conv:    GET   /group_member/conversation_of/:user_id" 

  4) MESSAGES :
    // #1- Get all messages:  POST    /message/:conversation_id 
    // #2- Write message:     POST    /message/:conversation_id 
    // #3- Edit message:      PUT     /message/:conversation_id 
    // #4- Delete message:    DELETE  /message/:conversation_id 
  `
);
