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
            },
            include: [
                {
                  model: UserModel,
                  as: 'person1', 
                  attributes: ['id', 'name', 'lastname', 'profile_image']
                },
                {
                  model: UserModel,
                  as: 'person2', 
                  attributes: ['id', 'name', 'lastname', 'profile_image']
                }
              ]
            
          })
          const respuesta : Array<object> = [];
          let contador = 0;
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
                    }
                ]
                });
                if (ultimoMensaje) {
                    const userChat : any= chats[contador].toJSON();
                    const personWithChat = userChat.person1.id != userId ? userChat.person1 : userChat.person2
                    const mensajeCompleto = {
                        ...ultimoMensaje.dataValues,
                        personWithChat
                    }                    
                    respuesta.push(mensajeCompleto);
                }
            }   
            contador++;         
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

        const existingChat = await ChatModel.findOne({
            where: {
                [Op.or]: [
                    {
                        person1ID: userId,
                        person2ID: person2ID
                    },
                    {
                        person1ID: person2ID,
                        person2ID: userId
                    }
                ]
            }
        });

        if (existingChat) {
            return res.status(400).json({ msg: "Ya existe un chat entre estos usuarios" });
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
