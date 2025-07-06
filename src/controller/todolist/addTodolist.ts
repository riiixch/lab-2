import { Request, Response } from "express";
import { todolist } from "../../cache";

import { ValidationSchema, validateInput } from "../../plugin/validator";

export default function addTodolist(req: Request, res: Response) {
    const scheme: ValidationSchema = {
        title: {
            type: 'string',
            minLength: 1,
            required: true,
        },
        descript: {
            type: 'string',
            minLength: 1,
            required: true,
        },
        completed: {
            type: 'boolean',
            required: true,
        },
    };

    const validate = validateInput(req.body, scheme);

    if (!validate.success) {
        res.status(400).json({ msg: validate.errorMsg });
        return;
    }

    let id = todolist.length;

    const { title, descript, completed } = validate.data;

    const newTodolist = {
        id,
        title,
        descript,
        completed,
    };

    todolist.push(newTodolist);

    res.status(200).json({ msg: 'ข้อมูลถูกเพิ่มแล้ว' });
}