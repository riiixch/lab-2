import express from "express";
import cors from "cors";

import hello from "./controller/hello";

import todolistRouter from "./router/todolist";
import stockRouter from "./router/stock";

const app = express();

app.use(express.json());
app.use(cors({
  origin: true, // อนุญาตเฉพาะ origin นี้ หรือ true เพื่ออนุญาติทั้งหมด
  methods: [ 'GET', 'POST', 'PUT', 'DELETE' ], // อนุญาตเฉพาะ methods ที่ระrelate
  allowedHeaders: [ 'Content-Type', 'Authorization' ], // กำหนด headers ที่อนุญาต
  credentials: true, // อนุญาตให้ส่ง cookies หรือ credentials
}));

app.get('/hello', hello);
app.use('/api/todolist', todolistRouter);
app.use('/api/stock', stockRouter);

export default app;