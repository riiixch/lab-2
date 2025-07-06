import { Request, Response } from "express";
import { stock } from "../../cache";

export default function getStock(req: Request, res: Response) {
    res.status(200).json({ stock });
}