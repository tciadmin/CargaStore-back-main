import { Request, Response } from 'express';
import { DriverModel, TruckModel, UserModel } from '../models';
import { DriverInterface } from '../interface/driver.interface';
import { TruckInterface } from '../interface/truck.interface';

const createDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    picture, // string
    num_license, //integer
    exp_license, //date
    description, //string
    brand, //string
    model, //string
    year, //integer
    charge_type, //seca | peligrosa | refrigerada
  } = req.body;
  try {
    if (
      !picture ||
      !num_license ||
      !exp_license ||
      !description ||
      !brand ||
      !model ||
      !year ||
      !charge_type
    ) {
      return res.status(400).json({ msg: 'Faltan parametros' });
    }

    const driverData: DriverInterface = {
      picture,
      num_license,
      exp_license,
      description,
    };
    const truckData: TruckInterface = {
      brand,
      model,
      year,
      charge_type,
    };
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const newTruck = await TruckModel.create(truckData);
    const newDriver: DriverInterface = await DriverModel.create({
      ...driverData,
      userId: user?.id,
      user: user,
      truckId: newTruck.id,
      truck: newTruck,
    });
    await user.update({ driverId: newDriver.id });
    return res.status(200).json({
      msg: 'Conductor creado con exito!!',
      driver: newDriver,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { createDriver };
