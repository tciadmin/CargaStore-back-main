import { NextFunction, Request, Response } from 'express';
import { DriverModel, TruckModel, UserModel } from '../models';
import { DriverInterface } from '../interface/driver.interface';
import { TruckInterface } from '../interface/truck.interface';
import Config from '../config';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { isMulterRequestFiles } from '../config/multerConfig';
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
    console.log(newTruck);

    const newDriver: DriverInterface = await DriverModel.create({
      userId: userId,
      truckId: newTruck.id,
    });

    await user.update({ driverId: newDriver.id });

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
        profile_image: user.profile_image,
      },
      driver,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await DriverModel.findAll({
      attributes: ['userId'],
      include: [
        {
          model: UserModel,
          as: 'user_driver',
          attributes: ['profile_image', 'name', 'lastname'],
        },
      ],
    }); // Obtiene todos los registros de la tabla drivers
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
const findDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { driverId } = req.params;
    const driver = await DriverModel.findByPk(driverId);
    if (!driver) {
      return res
        .status(404)
        .json({ error: 'Conductor no encontrado' });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const patchDriverLegalDocuments = async (
  req: Request,
  res: Response
) => {
  const { driverId } = req.params;
  const { num_license, iess, port_permit, insurance_policy } =
    req.body;
  try {
    const driver = await DriverModel.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    await driver?.update({
      num_license,
      iess,
      port_permit,
      insurance_policy,
    });
    res.status(200).json({ msg: 'Documentos legales editado' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const patchPdfLegalDocumentsDriver = async (
  req: Request,
  res: Response
) => {
  const { driverId } = req.params;
  try {
    if (!isMulterRequestFiles(req.files)) {
      return res.status(400).json({ msg: 'Error al subir los pdf' });
    }
    const files = req.files;

    const driver = await DriverModel.findByPk(driverId);
    if (driver?.pdf_iess) {
      fs.unlinkSync(driver?.pdf_iess);
    }
    if (driver?.pdf_port_permit) {
      fs.unlinkSync(driver?.pdf_port_permit);
    }

    const updatedData: Partial<DriverInterface> = {
      pdf_iess: files.pdf_iess
        ? files.pdf_iess[0].path
        : driver?.pdf_iess,
      pdf_port_permit: files.pdf_port_permit
        ? files.pdf_port_permit[0].path
        : driver?.pdf_port_permit,
    };

    await driver?.update(updatedData);

    res.status(200).json({ msg: 'pdf actualizados con exito' });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send(error);
  }
};

const patchImagesLegalDocuments = async (
  req: Request,
  res: Response
) => {
  const { driverId } = req.params;
  try {
    if (!isMulterRequestFiles(req.files)) {
      return res
        .status(400)
        .json({ msg: 'Error al subir las imagenes' });
    }
    const files = req.files;

    const driver = await DriverModel.findByPk(driverId);
    if (driver?.img_insurance_policy) {
      fs.unlinkSync(driver?.img_insurance_policy);
    }
    if (driver?.img_driver_license) {
      fs.unlinkSync(driver?.img_driver_license);
    }

    const updatedData: Partial<DriverInterface> = {
      img_insurance_policy: files.img_insurance_policy
        ? files.img_insurance_policy[0].path
        : driver?.img_insurance_policy,
      img_driver_license: files.img_driver_license
        ? files.img_driver_license[0].path
        : driver?.img_driver_license,
    };

    await driver?.update(updatedData);

    res.status(200).json({ msg: 'imagenes actualizadas con exito' });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send(error);
  }
};

const validateDriver = async (req: Request, res: Response) => {
  const { driverId } = req.params;
  try {
    const driver = await DriverModel.findByPk(driverId);
    if (!driver) {
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    let msg = '';
    await driver?.update({
      validate_by_admin: !driver?.validate_by_admin,
    });
    if (!driver?.validate_by_admin) {
      msg = 'Conductor invalidado';
    } else {
      msg = 'Conductor validado';
    }
    res.status(200).json({ msg });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send(error);
  }
};

export default {
  createDriver,
  getDriverByUserId,
  patchDriver,
  findDriver,
  patchDriverLegalDocuments,
  patchPdfLegalDocumentsDriver,
  patchImagesLegalDocuments,
  validateDriver,
  getAllDrivers,
};
