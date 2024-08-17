import { Request, Response } from 'express';
import { ChatModel, MessageModel, UserModel } from '../models';

const createNewMessage = async (
  chatID: string,
  emisorID: number,
  messageContent: string
) => {
  return await MessageModel.create({
    chatID,
    emisorID,
    message: messageContent,
  });
};

const getLastMessage = async (chatID: string) => {
  return await MessageModel.findOne({
    where: { chatID },
    include: [
      {
        model: UserModel,
        as: 'user',
        attributes: ['id', 'name', 'lastname', 'profile_image'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getAllMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.id as string;

    const { chatID } = req.params;
    if (!userId) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }
    if (!chatID) {
      return res.status(400).json({ msg: 'Debe enviar un chat id' });
    }

    const datosdelchat = await ChatModel.findByPk(chatID);
    const usuariosPertenecenAlchat =
      datosdelchat?.dataValues.person1ID == userId ||
      datosdelchat?.dataValues.person2ID == userId;
    if (!usuariosPertenecenAlchat) {
      return res
        .status(401)
        .json({ msg: 'El usuario no pertenece al chat' });
    }

    const latestMessage = await MessageModel.findAll({
      where: { chatID },
      order: [['createdAt', 'DESC']],
    });

    if (!latestMessage) {
      return res
        .status(404)
        .json({ msg: 'No se encontraron mensajes para este chat' });
    }

    return res.status(200).json(latestMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default { createNewMessage, getLastMessage, getAllMessages };
