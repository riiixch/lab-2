import express from "express";
import getStock from "../controller/stock/getStock";
import addStock from "../controller/stock/addStock";
import editStock from "../controller/stock/editStock";
import delStock from "../controller/stock/delStock";

const stockRouter = express.Router();

stockRouter.get('/', getStock);
stockRouter.post('/', addStock);
stockRouter.put('/:sto_id', editStock);
stockRouter.delete('/:sto_id', delStock);

export default stockRouter;