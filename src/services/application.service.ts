import { Request, Response } from 'express';
import { ApplicationModel, OrderModel } from '../models';

const applyForOrder = async (req: Request, res: Response) => {
  try {
    const { driverId, orderId } = req.body;
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

    order.assignedDriverId = driverId;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { applyForOrder, assignDriverToOrder };
