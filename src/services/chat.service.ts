import { Request, Response } from "express";
import { ChatModel } from "../models";

const createNewChat = async (req: Request, res: Response) => {
    try {
        const  userId  = req.headers.id;
        const { person2ID } = req.body;
        
        if (!userId) {
            return res.status(401).json({ msg: "Usuario no autorizado" })
        }
        if (!person2ID) {
            return res.status(400).json({ msg: "No se envió ID del receptor en el body" })
        }

        const responseJson: object = {
            person1ID: userId,
            person2ID
        };
        await ChatModel.create(responseJson)
        return res.status(201).json({ msg: "El chat se creó con éxito" });
    } catch (error) {
        // Maneja cualquier error interno y retorna un mensaje de error
        
        return res.status(500).json(error);
    }
};


export default {createNewChat};
