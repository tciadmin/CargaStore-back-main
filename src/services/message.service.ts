import { Request, Response } from "express";
import { ChatModel, MessageModel } from "../models";

const createNewMessage = async (
    userId:string,
     message:string,
     chatID:string, 
     image:string,
     readStatus:boolean) => {
    try {    
       
        
        const datosdelchat = await ChatModel.findByPk(chatID);
        const usuariosPertenecenAlchat = (datosdelchat?.dataValues.person1ID == userId) || (datosdelchat?.dataValues.person2ID == userId);
        if (!usuariosPertenecenAlchat) {
            return false;
        }
        let objetoRespuesta: object = { emisorID: parseInt(userId), chatID, message, readStatus: readStatus === true ? true : false,image };
        
        await MessageModel.create(objetoRespuesta)
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};
const getLastMessage = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.id as string;

        const { chatID } = req.body;
        if (!userId) {
            return res.status(401).json({ msg: "Usuario no autorizado" })
        }
        if (!chatID) {
            return res.status(400).json({ msg: "Debe enviar un chat id" })
        }

        const datosdelchat = await ChatModel.findByPk(chatID);
        const usuariosPertenecenAlchat = (datosdelchat?.dataValues.person1ID == userId) || (datosdelchat?.dataValues.person2ID == userId);
        if (!usuariosPertenecenAlchat) {
            return res.status(401).json({ msg: "El usuario no pertenece al chat" })
        }

        const latestMessage = await MessageModel.findAll({
            where: { chatID },
            order: [['createdAt', 'ASC']],
        });

        if (!latestMessage) {
            return res.status(404).json({ msg: "No se encontraron mensajes para este chat" });
        }

        return res.status(200).json(latestMessage[0]);
    } catch (error) {

        return res.status(500).json(error);
    }
};

const getAllMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.headers.id as string;

        const { chatID } = req.params;
        if (!userId) {
            return res.status(401).json({ msg: "Usuario no autorizado" })
        }
        if (!chatID) {
            return res.status(400).json({ msg: "Debe enviar un chat id" })
        }

        const datosdelchat = await ChatModel.findByPk(chatID);
        const usuariosPertenecenAlchat = (datosdelchat?.dataValues.person1ID == userId) || (datosdelchat?.dataValues.person2ID == userId);
        if (!usuariosPertenecenAlchat) {
            return res.status(401).json({ msg: "El usuario no pertenece al chat" })
        }

        const latestMessage = await MessageModel.findAll({
            where: { chatID },
            order: [['createdAt', 'DESC']],
        });

        if (!latestMessage) {
            return res.status(404).json({ msg: "No se encontraron mensajes para este chat" });
        }

        return res.status(200).json(latestMessage);
    } catch (error) {

        return res.status(500).json(error);
    }
};



export default { createNewMessage, getLastMessage, getAllMessages };
