import { Request, Response } from "express";
import { todolist } from "../../cache";

export default function getTodolist(req: Request, res: Response) {
    res.status(200).json({ todolist });
}