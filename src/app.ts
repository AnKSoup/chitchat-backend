import Express = require("express");
import 'dotenv/config';

//Routers:
import { routeUser } from "./routes/user.js";

// Init app:
const app = Express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('eloo chitchat')
});

//Routers:
app.use('/user', routeUser);