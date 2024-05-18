import { Request, Response } from 'express';
import { DriverModel, UserModel } from '../models';
import { DriverInterface } from '../interface/driver.interface';

const createDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { picture, num_license, exp_license, description } = req.body;
  try {
    if (!picture || !num_license || !exp_license || !description) {
      return res
        .status(400)
        .json({ msg: 'Faltan parametros para crear producto' });
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    const driverData = {
      picture,
      num_license,
      exp_license,
      description,
    };
    const newDriver: DriverInterface = await DriverModel.create({
      ...driverData,
      userId: user.id,
    });
    await user.update({ driverId: newDriver.id });
    return res.status(200).json({ driver: newDriver });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { createDriver };
