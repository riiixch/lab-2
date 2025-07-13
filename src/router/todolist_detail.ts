import express from "express";

import getTodolistDetail from "../controller/todolist_detail/getTodolistDetail";
import addTodolistDetail from "../controller/todolist_detail/addTodolistDetail";
import editTodolistDetail from "../controller/todolist_detail/editTodolistDetail";
import delTodolistDetail from "../controller/todolist_detail/delTodolistDetail";

const todolistDetailRouter = express.Router();

todolistDetailRouter.get('/', getTodolistDetail);
todolistDetailRouter.get('/:td_id', getTodolistDetail);
todolistDetailRouter.post('/', addTodolistDetail);
todolistDetailRouter.put('/:td_id', editTodolistDetail);
todolistDetailRouter.delete('/:td_id', delTodolistDetail);

export default todolistDetailRouter;