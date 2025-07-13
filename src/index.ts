import express from "express";
import cors from "cors";

import todolistRouter from "./router/todolist";

import authRouter from "./router/auth";
import isLogin from "./middleware/isLogin";
import todolistDetailRouter from "./router/todolist_detail";

const app = express();

//app.disable('x-powered-by');

app.use(express.json());
app.use(cors({
  origin: true, // อนุญาตเฉพาะ origin นี้ หรือ true เพื่ออนุญาติทั้งหมด
  methods: [ 'GET', 'POST', 'PUT', 'DELETE' ], // อนุญาตเฉพาะ methods ที่ระrelate
  allowedHeaders: [ 'Content-Type', 'Authorization' ], // กำหนด headers ที่อนุญาต
  credentials: true, // อนุญาตให้ส่ง cookies หรือ credentials
}));

app.use('/api/auth', authRouter);

app.use('/api/todolist', isLogin, todolistRouter);
app.use('/api/todolistdetail', isLogin, todolistDetailRouter);

export default app;