import express from "express";

import getTodolist from "../controller/todolist/getTodolist";
import addTodolist from "../controller/todolist/addTodolist";
import editTodolist from "../controller/todolist/editTodolist";
import delTodolist from "../controller/todolist/delTodolist";

const todolistRouter = express.Router();

todolistRouter.get('/', getTodolist);
todolistRouter.get('/:to_id', getTodolist);
todolistRouter.post('/', addTodolist);
todolistRouter.put('/:to_id', editTodolist);
todolistRouter.delete('/:to_id', delTodolist);

export default todolistRouter;