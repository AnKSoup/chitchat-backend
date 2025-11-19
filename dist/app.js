import Express from "express";
import { urlencoded } from "express";
import "dotenv/config";
//Routers:
import { routeUser } from "./routes/user.route.js";
import { routeConversation } from "./routes/converstation.route.js";
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
// //General Error handler: (Prevents any crash.)
// // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
// app.use((err: any, req: any, res: any, next: any) => {
//   const result = iro(false, "Error occurred.", 500, err.message);
//   operationToResponse(res, result);
// });
// #ENDPOINTS (delete later, is for easier testing)
console.log(`
  ### LIST OF ENDPOINTS: ###

  1) USER :
    #1- Sign in:    POST    /user/                
    #2- Log in:     POST    /user/login           
    #3- Log out:    POST    /user/logout          
    #5- Update:     PUT     /user/:id             
    #6- Delete:     DELETE  /user/:id             
    #7- Get id:     GET     /user/get_id          
    #8- Get b name: GET     /user/search/:username
    #9- Chang pass: PUT     /user/change_pass/:id 

  2) CONVERSATION :
    #1- Get conv:      GET     /conversation/:id 
    #2- Create conv:   POST    /conversation/    
    #3- Update conv:   PUT     /conversation/:id 
    #4- Delete conv:   DELETE  /conversation/:id 
  `);
//# sourceMappingURL=app.js.map