import { Request, Response } from 'express';
import {
  ApplicationModel,
  OrderModel,
  PayModel,
  PackageModel,
  DriverModel,
} from '../models';
import { OrderStatus } from '../models/orders.model';
import { PayStatus } from '../models/pay.model';

const applyForOrder = async (req: Request, res: Response) => {
  try {
    const { driverId, orderId } = req.body;
    const order = await OrderModel.findByPk(orderId);
    const driver = await DriverModel.findByPk(driverId);
    if (!order) {
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Orden no encontrada',
        },
      });
    }
    if (!driver) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Conductor no encontrado',
        },
      });
    }
    if (!driver.validate_by_admin) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Tu cuenta no está verificada por el administrador',
        },
      });
    }
    if (order.assignedDriverId || order.pendingAssignedDriverId) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Esta orden ya tiene un conductor asignado',
        },
      });
    }
    const application = await ApplicationModel.create({
      driverId,
      orderId,
    });
    res.status(201).json({
      application,
      msg: {
        msg1: 'Postulación enviada',
        msg2: 'Si te asignan el envío recibirás una notificación',
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const assignDriverToOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, driverId } = req.body;

    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.pendingAssignedDriverId = driverId;
    await order.save();

    res.status(200).json({
      msg: 'Conductor asignado a orden con exito',
      pendingAssignedDriverId: order.pendingAssignedDriverId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const declineOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    const application = await ApplicationModel.findOne({
      where: {
        orderId: orderId,
        driverId: order.pendingAssignedDriverId,
      },
    });

    if (!application) {
      return res
        .status(404)
        .json({ message: 'Application not found' });
    }

    await application.destroy();

    order.pendingAssignedDriverId = null;
    await order.save();
    res.status(200).json({
      msg: 'Orden rechazada',
      deletedApplication: application,
      pendingAssignedDriverId: order.pendingAssignedDriverId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const aceptOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId, {
      include: [{ model: PackageModel, as: 'package' }],
    });

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    if (!order.package) {
      return res.status(404).json({ msg: 'Paquete no encontrado' });
    }

    order.assignedDriverId = order.pendingAssignedDriverId;
    order.pendingAssignedDriverId = null;
    order.status = OrderStatus.ASIGNADO;

    //Una vez que el conductor acepta el envío se limpia la lista de postulaciones de la misma

    await order.save();
    await ApplicationModel.destroy({
      where: {
        orderId,
      },
    });

    // Crear instancia de Pay con estado "pendiente" para esta orden
    const newPay = await PayModel.create({
      total: order.package.offered_price,
      customerId: order.customerId,
      driverId: order.assignedDriverId,
      status: PayStatus.PENDIENTE,
      orderId: orderId,
    });

    // Asignar el id del pay a la order
    order.payId = newPay.id;
    await order.save();

    res.status(200).json({
      msg: 'Orden aceptada',
      pay: newPay,
      orderStatus: order.status,
      pendingAssignedDriverId: null,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  applyForOrder,
  assignDriverToOrder,
  declineOrder,
  aceptOrder,
};
