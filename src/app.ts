import Express = require("express");

// Init app :
const app = Express();
const port = 3333;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});