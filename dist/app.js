import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const Express = __require("express");
import 'dotenv/config';
// Init app:
const app = Express();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
app.get('/', (req, res) => {
    res.send('eloo chitchat');
});
//# sourceMappingURL=app.js.map