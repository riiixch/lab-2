import { Request } from "express";
import { decodeJWT } from "../plugin/JWT";

export default async function getUserJWT(req: Request) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return null;
        }

        const userJWTData = await decodeJWT(token);

        const { user_id, username, email } = userJWTData;

        return { user_id, username, email }
    } catch (error) {
        
    }
}