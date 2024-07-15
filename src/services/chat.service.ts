import { Request, Response } from "express";
import { ChatModel, MessageModel, UserModel } from "../models";
import { Op } from "sequelize";
const getAllUserChat = async (req:Request, res:Response)=>{
    try{
        const userId = req.headers.id;
        if(!userId){
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }

        const chats = await ChatModel.findAll({
            where: {
              [Op.or]: [
                { person1ID: userId },
                { person2ID: userId }
              ]
            }
          })
          const respuesta : Array<object> = []
        if(chats.length > 0){
            for (const e of chats) {
                const ultimoMensaje = await MessageModel.findOne({
                    where: {
                        chatID: e.id
                    },
                    include: [{
                        model: UserModel,
                        as: 'user',
                        attributes: ['id', 'name', 'lastname','profile_image'] // Ajusta los atributos que quieres traer
                    }]
                });
                if (ultimoMensaje) {
                    respuesta.push(ultimoMensaje.dataValues);
                }
            }

            
        }
          
       return  res.status(200).json( respuesta)
    }catch(error){
        console.log(error)
       return res.status(500).json(error)
    }
}
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


export default {createNewChat, getAllUserChat};
