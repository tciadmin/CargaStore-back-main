import { Request, Response } from 'express';
import { ApplicationModel, OrderModel } from '../models';
import { OrderStatus } from '../models/orders.model';

const applyForOrder = async (req: Request, res: Response) => {
  try {
    const { driverId, orderId } = req.body;
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }
    if (order.assignedDriverId || order.pendingAssignedDriverId) {
      return res
        .status(400)
        .json({ msg: 'Esta orden ya tiene un conductor asignado' });
    }
    const application = await ApplicationModel.create({
      driverId,
      orderId,
    });
    res.status(201).json(application);
  } catch (error) {
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

    res
      .status(200)
      .json({ msg: 'Conductor asignado a orden con exito', order });
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
    order.pendingAssignedDriverId = null;
    await order.save();
    res.status(200).json({ msg: 'Orden rechazada' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const aceptOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }
    order.assignedDriverId = order.pendingAssignedDriverId;
    order.pendingAssignedDriverId = null;
    order.status = OrderStatus.ASIGNADO;
    await order.save();
    res.status(200).json({ msg: 'Orden aceptada' });
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
