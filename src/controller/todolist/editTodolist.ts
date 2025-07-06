import { Request, Response } from "express";
import { todolist } from "../../cache";

import { ValidationSchema, validateInput } from "../../plugin/validator";

export default function editTodolist(req: Request, res: Response) {
    const to_id = req.params.to_id;

    if (!to_id || to_id === '') {
        res.status(400).json({ msg: 'ไม่มี to_id' });
        return;
    }

    const index = todolist.findIndex(to => to.id === Number(to_id));
    if (index < 0) {
        res.status(400).json({ msg: 'ไม่พบ Todolist ID นี้' });
        return;
    }

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

    const { title, descript, completed } = validate.data;

    todolist[index].title = title;
    todolist[index].descript = descript;
    todolist[index].completed = completed;

    res.status(200).json({ msg: 'แก้ไข Todolist ID ' + index + ' สำเร็จ' });
}