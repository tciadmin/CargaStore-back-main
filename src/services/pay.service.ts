import { Request, Response } from "express";
import { DriverModel, PayModel, UserModel, OrderModel } from "../models";
import { PayStatus } from "../models/pay.model";
import { PayInterface } from "../interface/pay.interface";

const payDriver = async (req: Request, res: Response) => {
  try {
    const { userId, customerId, driverId, total, orderId } =
      req.body as PayInterface;

    if (userId === undefined) {
      return res.status(400).json({ msg: "userId es requerido" });
    }

    // Verificar si la orden asociada a orderId existe
    const orderExists = await OrderModel.findByPk(orderId);
    if (!orderExists) {
      return res.status(404).json({ msg: "La orden asociada no existe" });
    }

    // Crear o actualizar el pago si ya existe
    let pay = await PayModel.findOne({
      where: { orderId: orderId, status: PayStatus.PENDIENTE },
    });

    if (!pay) {
      // Crear un nuevo pago si no existe
      pay = await PayModel.create({
        total: total,
        userId: userId,
        customerId: customerId,
        driverId: driverId || null,
        status: PayStatus.ACREDITADO,
        orderId: orderId,
      });
    } else {
      // Actualizar el pago existente
      pay.total = total;
      pay.userId = userId;
      pay.customerId = customerId;
      pay.driverId = driverId || null;
      pay.status = PayStatus.ACREDITADO;
      await pay.save();
    }

    // Asociar el payId a la orden
    orderExists.payId = pay.id;
    await orderExists.save();

    res.status(200).json({ msg: "Pago acreditado", pay });
  } catch (error) {
    res.status(500).send(error);
  }
};

const adminHistoryPay = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findByPk(userId, {
      include: [{ model: PayModel, include: [DriverModel], as: "pays" }],
    });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.status(200).json({ pays: user.pays });
  } catch (error) {
    res.status(500).send(error);
  }
};

const driverHistoryPay = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const driver = await DriverModel.findByPk(driverId, {
      include: [
        {
          model: PayModel,
          include: [
            {
              model: UserModel,
              attributes: { exclude: ["password"] },
            },
          ],
          as: "pays",
        },
      ],
    });
    if (!driver) {
      return res.status(404).json({ msg: "Conductor no encontrado" });
    }
    res.status(200).json({ pays: driver.pays });
  } catch (error) {
    res.status(500).send(error);
  }
};

const payListWithFilter = async (req: Request, res: Response) => {
  const { status } = req.query; // pendiente | acreditado
  try {
    const allPays = await PayModel.findAll({
      where: { status: status },
      include: [
        { model: UserModel, attributes: ["id", "name", "lastname", "email"] },
        { model: DriverModel, attributes: ["id", "picture", "num_license"] },
      ],
    });
    res.status(200).json({ pays: allPays });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  payDriver,
  adminHistoryPay,
  driverHistoryPay,
  payListWithFilter,
};
