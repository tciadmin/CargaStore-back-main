import { Request, Response } from "express";
import { DriverModel, TruckModel, UserModel } from "../models";
import { DriverInterface } from "../interface/driver.interface";
import { TruckInterface } from "../interface/truck.interface";

const createDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    picture, // string
    num_license, //integer
    description, //string
    phone, //integer
    brand, //string
    model, //string
    year, //integer
    charge_type, //seca | peligrosa | refrigerada
    num_plate, //matricula
    capacity, //capacidad de carga en numero
    charge_capacity, //capacidad de carga "toneladas"o "litros" o "kilos"
  } = req.body;
  try {
    if (
      !picture ||
      !num_license ||
      !description ||
      !phone ||
      !brand ||
      !model ||
      !year ||
      !num_plate ||
      !capacity ||
      !charge_capacity ||
      !charge_type
    ) {
      return res.status(400).json({ msg: "Faltan parametros" });
    }

    const driverData: DriverInterface = {
      picture,
      num_license,
      description,
      phone,
    };
    const truckData: TruckInterface = {
      brand,
      model,
      year,
      charge_type,
      num_plate,
      capacity,
      charge_capacity,
    };
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
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
      msg: "Conductor creado con exito!!",
      driver: newDriver,
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
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Obtener información del conductor asociado al usuario, incluyendo el camión
    const driver = await DriverModel.findOne({
      where: { userId },
      include: [
        {
          model: TruckModel,
          as: "truck",
        },
      ],
    });

    if (!driver) {
      return res.status(404).json({ msg: "Conductor no encontrado" });
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

const patchDriver = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, lastname, description, phone } = req.body;

  try {
    // Verificar que los campos no estén vacíos
    if (!name || !lastname || !description || !phone) {
      return res.status(400).json({ msg: "Faltan parámetros" });
    }

    // Update user's name and lastname
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    await user.update({ name, lastname });

    // Find and update driver's description
    const driver = await DriverModel.findOne({ where: { userId } });
    if (!driver) {
      return res.status(404).json({ msg: "Conductor no encontrado" });
    }
    await driver.update({ description, phone });

    return res
      .status(200)
      .json({ msg: "Usuario y conductor actualizados correctamente" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { createDriver, getDriverByUserId, patchDriver };
