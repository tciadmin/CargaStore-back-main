import { Request, Response } from "express";
import { DriverModel, TruckModel, UserModel } from "../models";
import { TruckInterface } from "../interface/truck.interface";
import { ChargeType, ChargeCapacity } from "../models/trucks.model";

const patchTruck = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    brand,
    model,
    year,
    charge_type,
    num_plate,
    capacity,
    charge_capacity,
  }: TruckInterface = req.body;

  try {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const driver = await DriverModel.findOne({
      where: { userId },
      include: [
        {
          model: TruckModel,
          as: "truck",
        },
      ],
    });

    if (!driver || !driver.truck) {
      return res.status(404).json({ msg: "Camión no encontrado" });
    }

    const truck = driver.truck;

    // Verificar que ninguno de los atributos esté vacío
    if (
      brand === undefined ||
      model === undefined ||
      year === undefined ||
      charge_type === undefined ||
      num_plate === undefined ||
      charge_capacity === undefined ||
      capacity === undefined
    ) {
      return res.status(400).json({ msg: "Faltan atributos" });
    }

    // Actualizar solo los atributos proporcionados en el cuerpo de la solicitud
    truck.brand = brand;
    truck.model = model;
    truck.year = year;
    truck.charge_type = charge_type;
    truck.num_plate = num_plate;
    truck.capacity = capacity;
    truck.charge_capacity = charge_capacity;

    await truck.save();

    return res.status(200).json({
      msg: "Camión actualizado con éxito",
      truck,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el camión" });
  }
};

export default { patchTruck };
