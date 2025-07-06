import { Request, Response } from "express";
import { stock } from "../../cache";

import { ValidationSchema, validateInput } from "../../plugin/validator";

export default function addStock(req: Request, res: Response) {
    const scheme: ValidationSchema = {
        product: {
            type: 'string',
            minLength: 1,
            required: true,
        },
        in_stock: {
            type: 'integer',
            min: 0,
            required: true,
        },
        out_stock: {
            type: 'integer',
            min: 0,
            required: true,
        },
    };

    const validate = validateInput(req.body, scheme);

    if (!validate.success) {
        res.status(400).json({ msg: validate.errorMsg });
        return;
    }

    let id = stock.length;

    const { product, in_stock, out_stock } = validate.data;

    const newStock = {
        id,
        product,
        in_stock,
        out_stock,
    };

    stock.push(newStock);

    res.status(200).json({ msg: 'ข้อมูลถูกเพิ่มแล้ว' });
}