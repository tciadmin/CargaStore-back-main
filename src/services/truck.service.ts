import { Request, Response } from 'express';
import { DriverModel, TruckModel, UserModel } from '../models';
import { TruckInterface } from '../interface/truck.interface';
import { vehicleData } from '../config/vehicleDataConfig';

// Función de validación para marca y modelo
const validateTruckData = (brand: string, model: string) => {
  // Verifica si la marca existe
  if (!vehicleData.marcas[brand]) {
    throw new Error('Marca no válida');
  }

  // Verifica si el modelo existe para esa marca
  if (!vehicleData.marcas[brand].includes(model)) {
    throw new Error('El modelo no es válido para esta marca');
  }
};

const getAllTrucks = async (req: Request, res: Response) => {
  try {
    const trucks = await TruckModel.findAll(); // Obtiene todos los camiones

    if (trucks.length === 0) {
      // Si no hay camiones, retorna un mensaje personalizado
      return res.status(200).json({ msg: 'No hay camiones aún' });
    }

    // Si hay camiones, retorna los camiones en formato JSON
    return res.status(200).json({ trucks });
  } catch (error) {
    // Maneja cualquier error interno y retorna un mensaje de error
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const patchTruck = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    brand,
    model,
    vehicle_type,
    year,
    charge_type,
    num_plate,
    charge_capacity,
    hasGps,
  }: TruckInterface = req.body;

  try {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Usuario no encontrado',
        },
      });
    }

    const driver = await DriverModel.findOne({
      where: { userId },
      include: [
        {
          model: TruckModel,
          as: 'truck',
        },
      ],
    });

    if (!driver || !driver.truck) {
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Camión no encontrado',
        },
      });
    }

    const truck = driver.truck;

    // Verificar que ninguno de los atributos esté vacío
    if (
      !brand ||
      !model ||
      !vehicle_type ||
      !year ||
      !charge_type ||
      !num_plate ||
      !charge_capacity
    ) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Faltan atributos',
        },
      });
    }

    const regex = /^\d{4}$/;

    if (!regex.test(String(year))) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Año debe ser un número de exactamente cuatro dígitos.',
        },
      });
    }

    validateTruckData(brand, model);

    // Actualizar solo los atributos proporcionados en el cuerpo de la solicitud
    truck.brand = brand;
    truck.model = model;
    truck.vehicle_type = vehicle_type;
    truck.year = year;
    truck.charge_type = charge_type;
    truck.num_plate = num_plate;
    truck.charge_capacity = charge_capacity;
    truck.hasGps = hasGps;

    await truck.save();

    return res.status(200).json({
      message: {
        type: 'success',
        msg: 'Datos del camión actualizado',
      },
      truck,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error al actualizar el camión' });
  }
};

interface CreateTruckData extends TruckInterface {
  userId: string;
  truckImage: string;
  plateImage: string;
}

const createTruck = async (data: CreateTruckData) => {
  const {
    userId,
    brand,
    model,
    vehicle_type,
    year,
    charge_type,
    num_plate,
    charge_capacity,
    hasGps,
    truckImage,
    plateImage,
  } = data;

  if (
    !userId || !brand || !model || !vehicle_type ||
    !year || !charge_type || !num_plate || !charge_capacity
  ) {
    throw new Error('Faltan atributos obligatorios');
  }

  if (!truckImage || !plateImage) {
    throw new Error('Debe subir ambas imágenes');
  }

  const regex = /^\d{4}$/;
  if (!regex.test(String(year))) {
    throw new Error('Año debe tener cuatro dígitos');
  }

  validateTruckData(brand, model);

  const user = await UserModel.findByPk(userId);
  if (!user) throw new Error('Usuario no encontrado');

  const driver = await DriverModel.findOne({ where: { userId } });
  if (!driver) throw new Error('Conductor no encontrado');

  const newTruck = await TruckModel.create({
    brand,
    model,
    vehicle_type,
    year,
    charge_type,
    num_plate,
    charge_capacity,
    hasGps,
    truckImage,
    plateImage,
    driverId: driver.id,
  });

  return {
    message: {
      type: 'success',
      msg: 'Camión creado correctamente',
    },
    truck: newTruck,
  };
};

export default { patchTruck, getAllTrucks, createTruck };
