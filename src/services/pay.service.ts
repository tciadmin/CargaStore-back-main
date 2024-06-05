import { Request, Response } from "express";
import { DriverModel, PayModel, UserModel, OrderModel } from "../models";
import { PayStatus } from "../models/pay.model";
import { PayInterface } from "../interface/pay.interface";

const payDriver = async (req: Request, res: Response) => {
  try {
    const { userId, driverId, total, orderId } = req.body as PayInterface;

    // Verificar si la orden asociada a orderId existe
    const orderExists = await OrderModel.findByPk(orderId);
    if (!orderExists) {
      return res.status(404).json({ msg: "La orden asociada no existe" });
    }

    const pay = await PayModel.findOne({
      where: { orderId: orderId, status: PayStatus.PENDIENTE },
    });

    if (!pay) {
      return res.status(404).json({ msg: "Pago pendiente no encontrado" });
    }

    pay.total = total;
    pay.userId = userId;
    pay.driverId = driverId || null; // Assign driverId or null if it's undefined
    pay.status = PayStatus.ACREDITADO; // Asigna el status "acreditado"

    await pay.save();

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
