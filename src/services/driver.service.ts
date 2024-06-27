import { Request, Response } from 'express';
import { DriverModel, TruckModel, UserModel } from '../models';
import { DriverInterface } from '../interface/driver.interface';
import { TruckInterface } from '../interface/truck.interface';
import { RoleType } from '../models/users.model';
import Config from '../config';
import jwt from 'jsonwebtoken';
const { secret } = Config;

const createDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    brand, // string
    model, // string
    year, // integer
    charge_type, // seca | peligrosa | refrigerada
    charge_capacity, // string
  } = req.body;

  try {
    if (
      !brand ||
      !model ||
      !year ||
      !charge_capacity ||
      !charge_type
    ) {
      return res.status(400).json({ msg: 'Faltan parametros' });
    }

    const truckData: TruckInterface = {
      brand,
      model,
      year,
      charge_type,
      charge_capacity,
    };

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const newTruck = await TruckModel.create(truckData);
    const newDriver: DriverInterface = await DriverModel.create({
      userId: user.id,
      truckId: newTruck.id,
    });

    await user.update({ driverId: newDriver.id });

    // Verificar el rol del usuario
    if (user.role !== null) {
      // Arrojar error si el usuario tiene un rol diferente a null
      return res.status(400).json({
        msg: 'Error. Este usuario ya está asignado con otro rol',
      });
    }

    // Asignar el rol de 'driver' si el rol es null
    user.role = RoleType.DRIVER;
    await user.save();

    const newUser = await UserModel.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: DriverModel,
          as: 'driver',
          include: [{ model: TruckModel, as: 'truck' }],
        },
      ],
    });
    const token = jwt.sign({ id: userId }, secret);

    return res.status(200).json({
      msg: 'Conductor registrado!, revise su correo electronico para validarlo.',
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Obtener un Conductor
const getDriverByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Obtener información del usuario
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Obtener información del conductor asociado al usuario, incluyendo el camión
    const driver = await DriverModel.findOne({
      where: { userId },
      include: [
        {
          model: TruckModel,
          as: 'truck',
        },
      ],
    });

    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }

    // Mostrar la información obtenida
    return res.status(200).json({
      user: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
      driver,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await DriverModel.findAll(); // Obtiene todos los registros de la tabla drivers
    return res.status(200).json(drivers); // Retorna los conductores en formato JSON
  } catch (error) {
    return res.status(500).send(error); // Maneja cualquier error que ocurra
  }
};

const patchDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, lastname, description, phone } = req.body;

  try {
    // Verificar que los campos no estén vacíos
    if (!name || !lastname || !description || !phone) {
      return res.status(400).json({ msg: 'Faltan parámetros' });
    }

    // Update user's name and lastname
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    await user.update({ name, lastname });

    // Find and update driver's description
    const driver = await DriverModel.findOne({ where: { userId } });
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    await driver.update({ description, phone });

    return res.status(200).json({
      msg: 'Usuario y conductor actualizados correctamente',
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  createDriver,
  getDriverByUserId,
  patchDriver,
  getAllDrivers,
};
