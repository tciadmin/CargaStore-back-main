import { Request, Response } from "express";
import { ChatModel, MessageModel, OrderModel, UserModel } from "../models";
import { Op } from "sequelize";
const getAllUserChat = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.id;
    if (!userId) {
      return res.status(401).json({ msg: "Usuario no autorizado" });
    }

    const chats = await ChatModel.findAll({
      where: {
        [Op.or]: [{ person1ID: userId }, { person2ID: userId }],
      },
      include: [
        {
          model: UserModel,
          as: "person1",
          attributes: ["id", "name", "lastname", "profile_image"],
        },
        {
          model: UserModel,
          as: "person2",
          attributes: ["id", "name", "lastname", "profile_image"],
        },
      ],
    });
    const respuesta: Array<object> = [];
    let contador = 0;
    if (chats.length > 0) {
      for (const e of chats) {
        const ultimoMensaje = await MessageModel.findOne({
          where: {
            chatID: e.id,
          },
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["id", "name", "lastname", "profile_image"], // Ajusta los atributos que quieres traer
            },
          ],
        });
        if (ultimoMensaje) {
          const userChat: any = chats[contador].toJSON();
          const personWithChat =
            userChat.person1.id != userId ? userChat.person1 : userChat.person2;
          const mensajeCompleto = {
            ...ultimoMensaje.dataValues,
            personWithChat,
          };
          respuesta.push(mensajeCompleto);
        }
      }
      contador++;
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const createNewChat = async (req: Request, res: Response) => {
  try {
    const userId = req.headers.id;
    const { orderId, driverId, messageContent } = req.body;

    if (!userId) {
      return res.status(401).json({ msg: "Usuario no autorizado" });
    }

    if (!orderId || !messageContent) {
      return res
        .status(400)
        .json({ msg: "Faltan datos requeridos en el body" });
    }

    const order = await OrderModel.findByPk(orderId, {
      include: ["customer", "assignedDriver"],
    });

    if (!order) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }

    const assignedDriverId = order.assignedDriverId;
    if (!assignedDriverId) {
      return res
        .status(400)
        .json({ msg: "No hay conductor asignado a esta orden" });
    }

    const customer = await UserModel.findByPk(order.customerId);
    const driver = await UserModel.findByPk(assignedDriverId);

    if (!customer || !driver) {
      return res.status(404).json({ msg: "Cliente o conductor no encontrado" });
    }

    const existingChat = await ChatModel.findOne({
      where: {
        [Op.or]: [
          { person1ID: customer.id, person2ID: driver.id },
          { person1ID: driver.id, person2ID: customer.id },
        ],
      },
    });

    let chatId;

    if (existingChat) {
      chatId = existingChat.id;
    } else {
      const responseJson: object = {
        person1ID: userId,
        person2ID: driver.id,
      };
      const newChat = await ChatModel.create(responseJson);

      chatId = newChat.id;
    }

    await MessageModel.create({
      chatID: chatId,
      emisorID: driver.id, 
      message: messageContent,
    });

    return res
      .status(201)
      .json({ msg: "Chat iniciado y mensaje enviado con éxito" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", error });
  }
};


// const createNewChat = async (req: Request, res: Response) => {
//     try {
//         const  userId  = req.headers.id;
//         const { person2ID } = req.body;

//         if (!userId) {
//             return res.status(401).json({ msg: "Usuario no autorizado" })
//         }
//         if (!person2ID) {
//             return res.status(400).json({ msg: "No se envió ID del receptor en el body" })
//         }

//         const existingChat = await ChatModel.findOne({
//             where: {
//                 [Op.or]: [
//                     {
//                         person1ID: userId,
//                         person2ID: person2ID
//                     },
//                     {
//                         person1ID: person2ID,
//                         person2ID: userId
//                     }
//                 ]
//             }
//         });

//         if (existingChat) {
//             return res.status(400).json({ msg: "Ya existe un chat entre estos usuarios" });
//         }

//         const responseJson: object = {
//             person1ID: userId,
//             person2ID
//         };
//         await ChatModel.create(responseJson)
//         return res.status(201).json({ msg: "El chat se creó con éxito" });
//     } catch (error) {
//         // Maneja cualquier error interno y retorna un mensaje de error

//         return res.status(500).json(error);
//     }
// };

export default { createNewChat, getAllUserChat };
