import { Request, Response } from 'express';
import { OrderModel } from '../models';

const orderList = async (req: Request, res: Response) => {
  //   const { userId } = req.params;
  try {
    const allOrders = await OrderModel.findAll({
      //   where: { UserId: userId },
    });

    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

export default { orderList };
