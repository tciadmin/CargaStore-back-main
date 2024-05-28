import { Request, Response } from 'express';
import { DriverModel, PayModel, UserModel } from '../models';

const payDriver = async (req: Request, res: Response) => {
  try {
    const { userId, driverId, total } = req.body;
    const pay = await PayModel.create({
      total,
      userId,
      driverId,
    });
    res.status(200).json({ msg: 'Pago acreditado', pay });
  } catch (error) {
    res.status(500).send(error);
  }
};

const adminHistoryPay = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findByPk(userId, {
      include: [
        { model: PayModel, include: [DriverModel], as: 'pays' },
      ],
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
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
              attributes: { exclude: ['password'] },
            },
          ],
          as: 'pays',
        },
      ],
    });
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    res.status(200).json({ pays: driver.pays });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { payDriver, adminHistoryPay, driverHistoryPay };
