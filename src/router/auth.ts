import express from "express";

import register from "../controller/auth/register";
import login from "../controller/auth/login";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;