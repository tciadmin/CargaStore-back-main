import { Request, Response } from "express";
import {
  DriverModel,
  PayModel,
  UserModel,
  OrderModel,
  PackageModel,
  FeedbackModel,
} from "../models";
import { PayStatus } from "../models/pay.model";
import { PayInterface } from "../interface/pay.interface";

const payDriver = async (req: Request, res: Response) => {
  try {
    const { driverId, total, orderId } = req.body as {
      driverId: string;
      total: number;
      orderId: number;
    };

    // Verificar si la orden asociada a orderId existe
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ msg: "La orden asociada no existe" });
    }

    // Obtener el customerId de la orden
    const customerId = order.customerId;

    // Crear o actualizar el pago si ya existe
    let pay = await PayModel.findOne({
      where: { orderId: orderId, status: PayStatus.PENDIENTE },
    });

    if (!pay) {
      // Crear un nuevo pago si no existe
      pay = await PayModel.create({
        total: total,
        customerId: customerId,
        driverId: driverId || null,
        status: PayStatus.ACREDITADO,
        orderId: orderId,
      });
    } else {
      // Actualizar el pago existente
      pay.total = total;
      pay.customerId = customerId;
      pay.driverId = driverId;
      pay.status = PayStatus.ACREDITADO;
      await pay.save();
    }

    // Asociar el payId a la orden
    order.payId = pay.id;
    await order.save();

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
    // res.status(200).json({ pays: user.pays });
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
      where: { status },
      include: [
        {
          model: OrderModel,
          attributes: [
            "id",
            "pick_up_city",
            "pick_up_date",
            "delivery_date",
            "customerId",
            "invoicePath",
            "packageId",
          ],
          include: [
            {
              model: PackageModel,
              attributes: ["product_name", "weight", "type", "offered_price"],
            },
          ],
        },
      ],
    });
    res.status(200).json({ pays: allPays });
  } catch (error) {
    res.status(500).send(error);
  }
};

const findPay = async (req: Request, res: Response) => {
  const { payId } = req.params;

  try {
    // Buscar el pago por payId
    const pay = await PayModel.findByPk(payId, {
      attributes: ["id", "customerId", "driverId", "orderId"],
      include: [
        {
          model: OrderModel,
          attributes: [
            "pick_up_address",
            "pick_up_city",
            "delivery_address",
            "delivery_city",
            "pick_up_date",
            "delivery_date",
            "packageId",
          ],
          include: [
            {
              model: PackageModel,
              attributes: ["quantity", "product_name"],
            },
          ],
        },
      ],
    });

    if (!pay) {
      return res.status(404).json({ msg: "Pago no encontrado" });
    }

    // Buscar feedbacks del driver
    const feedbacks = await FeedbackModel.findAll({
      where: { driverId: pay.driverId },
      attributes: ["score", "comment"],
    });

    res.status(200).json({ pay, feedbacks });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  payDriver,
  adminHistoryPay,
  driverHistoryPay,
  payListWithFilter,
  findPay,
};
