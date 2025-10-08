import Express = require("express");
import 'dotenv/config';

// Init app:
const app = Express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('eloo chitchat')
});
