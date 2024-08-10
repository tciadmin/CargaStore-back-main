import { Request, Response } from 'express';
import CustomerModel from '../models/customers.model';
import DriverModel from '../models/drivers.model';
import {
  ApplicationModel,
  OrderModel,
  TruckModel,
  UserModel,
} from '../models';
// import { isMulterSingleFile } from '../config/multerConfig';
import fs from 'fs';

const getAllCustomersAndDrivers = async (
  req: Request,
  res: Response
) => {
  try {
    // Trae clientes
    const customers = await CustomerModel.findAll(); // Obtiene todos los clientes

    // Trae conductores
    const drivers = await DriverModel.findAll(); // Obtiene todos los conductores

    // Verifica si no hay clientes ni conductores
    if (customers.length === 0 && drivers.length === 0) {
      // Si no hay clientes ni conductores, retorna un mensaje personalizado
      return res
        .status(200)
        .json({ msg: 'No hay clientes ni conductores aún' });
    }

    // Verifica si no hay conductores
    if (drivers.length === 0) {
      // Si no hay conductores, retorna un mensaje personalizado y los clientes
      return res
        .status(200)
        .json({ msg: 'No hay conductores aún', customers });
    }

    // Verifica si no hay clientes
    if (customers.length === 0) {
      // Si no hay clientes, retorna un mensaje personalizado y los conductores
      return res
        .status(200)
        .json({ msg: 'No hay clientes aún', drivers });
    }

    // Si hay clientes y conductores, retorna ambos en formato JSON
    return res.status(200).json({ customers, drivers });
  } catch (error) {
    // Maneja cualquier error interno y retorna un mensaje de error
    return res.status(500).json({ msg: 'Error interno' });
  }
};
const patchUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, lastname } = req.body;
  const regex = /^[a-zA-Z\s]+$/;
  const user = await UserModel.findByPk(userId);

  if (!regex.test(name) || !name) {
    console.log(
      'El nombre no puede contener números ni carácteres inválidos o estar vacío'
    );
    return res.status(400).json({
      message: {
        type: 'error',
        msg: 'El nombre no puede contener números ni carácteres inválidos o estar vacío',
      },
    });
  }
  if (!regex.test(lastname) || !lastname) {
    console.log(
      'El apellido no puede contener números ni carácteres inválidos o estar vacío'
    );
    return res.status(400).json({
      message: {
        type: 'error',
        msg: 'El apellido no puede contener números ni carácteres inválidos o estar vacío',
      },
    });
  }

  try {
    let profileImageUpdated = false;
    if (req.file) {
      if (user?.profile_image) {
        fs.unlinkSync(user.profile_image);
      }
      await UserModel.update(
        { profile_image: req.file.path },
        { where: { id: userId } }
      );

      profileImageUpdated = true;
    }

    const [updated] = await UserModel.update(
      { lastname, name },
      { where: { id: userId } }
    );

    if (updated || profileImageUpdated) {
      const updatedUser = await UserModel.findOne({
        where: { id: userId },
      });
      console.log('User updated successfully:', updatedUser);
      return res.status(200).json({
        message: {
          type: 'success',
          msg: 'Datos del usuario actualizado',
        },
        updatedUser,
      });
    }
    console.log('usuario no pudo actualizarse');

    return res
      .status(400)
      .json({ msg: 'Usuario no pudo actualizarse' });
  } catch (error) {
    console.log('ERROR: ', error);
    return res.status(500).json({ msg: 'Error interno' });
  }
};

const pageInfo = async (req: Request, res: Response) => {
  try {
    const viajesSinAsignar = await OrderModel.count({
      where: { status: 'pendiente' },
    });
    const viajesActivos = await OrderModel.count({
      where: { status: 'en curso' },
    });
    const viajesFinalizados = await OrderModel.count({
      where: { status: 'finalizado' },
    });
    const solicitudesDeViaje = await ApplicationModel.count();
    const sociosActivos = await DriverModel.count();
    const camionesRegistrados = await TruckModel.count();
    res.status(200).json({
      viajesSinAsignar,
      viajesActivos,
      viajesFinalizados,
      solicitudesDeViaje,
      sociosActivos,
      camionesRegistrados,
    });
  } catch (error) {
    console.log('ERROR: ', error);
    res.status(500).send({ msg: 'Error interno' });
  }
};

export default { getAllCustomersAndDrivers, patchUser, pageInfo };
