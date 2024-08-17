import { Request, Response } from 'express';
import {
  ChatModel,
  MessageModel,
  OrderModel,
  UserModel,
} from '../models';
import { Op } from 'sequelize';

const getAllUserChat = async (req: Request, res: Response) => {
  try {
    const id = req.headers.id as string; // Asegúrate de que el ID sea un string
    const userId = parseInt(id, 10);
    if (!userId) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    // Obtén todos los chats relacionados con el usuario
    const chats = await ChatModel.findAll({
      where: {
        [Op.or]: [{ person1ID: userId }, { person2ID: userId }],
      },
      include: [
        {
          model: UserModel,
          as: 'person1',
          attributes: ['id', 'name', 'lastname', 'profile_image'],
        },
        {
          model: UserModel,
          as: 'person2',
          attributes: ['id', 'name', 'lastname', 'profile_image'],
        },
      ],
    });

    const respuesta = await Promise.all(
      chats.map(async (chat) => {
        // Busca el último mensaje para cada chat
        const ultimoMensaje = await MessageModel.findOne({
          where: {
            chatID: chat.id,
          },
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: ['id', 'name', 'lastname', 'profile_image'],
            },
          ],
          order: [['createdAt', 'DESC']], // Asegúrate de obtener el último mensaje
        });

        if (ultimoMensaje) {
          const chatData = chat.toJSON();
          
          const personWithChat =
          chatData.person1.id === userId ? chatData.person2 : chatData.person1;
          
          return {
            ...ultimoMensaje.toJSON(),
            personWithChat,
          };
        }
        return null;
      })
    );

    // Filtra los valores nulos en caso de que algún chat no tenga mensajes
    const filteredResponse = respuesta.filter((item) => item !== null);

    return res.status(200).json(filteredResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Error del servidor', error });
  }
};

const createNewChat = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.id as string;
    const { orderId, driverId, messageContent } = req.body;

    if (!userId) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    if (!orderId || !messageContent || !driverId) {
      return res
        .status(400)
        .json({ msg: 'Faltan datos requeridos en el body' });
    }

    const order = await getOrderDetails(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    const chat: any = await findOrCreateChat(userId, driverId);

    await createMessage(chat.id, driverId, messageContent);

    return res
      .status(201)
      .json({ msg: 'Chat iniciado y mensaje enviado con éxito' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: 'Error interno del servidor', error });
  }
};

async function getOrderDetails(orderId: string) {
  return await OrderModel.findByPk(orderId, {
    include: ['customer', 'assignedDriver'],
  });
}

async function findOrCreateChat(
  person1ID: string,
  person2ID: string
) {
  // Ordena los IDs para asegurar que siempre se guarden en el mismo orden
  try {
    const [id1, id2] = [person1ID, person2ID].sort();

    const existingChat = await ChatModel.findOne({
      where: {
        person1ID: id1,
        person2ID: id2,
      },
    });

    if (existingChat) {
      return existingChat;
    }

    return await ChatModel.create({ person1ID: id1, person2ID: id2 });
  } catch (error) {
    console.log(error);
  }
}

async function createMessage(
  chatID: string,
  emisorID: number,
  messageContent: string
) {
  return await MessageModel.create({
    chatID,
    emisorID,
    message: messageContent,
  });
}

const findChatById = async (chatID: string) => {
  const findChat = await ChatModel.findByPk(chatID);
  return findChat;
};

export default { createNewChat, getAllUserChat, findChatById };
