import { config } from "dotenv"
config();

import app from ".";

import { log } from "console";

const port: Number = Number(process.env.PORT) || 3000

app.listen(port, () => {
    log('[Express] server listen port ', port);
});