import { Request, Response } from 'express';
import { CustomerModel, UserModel } from '../models';
import { CustomerInterface } from '../interface/customer.interface';
import Config from '../config';
import jwt from 'jsonwebtoken';
const { secret } = Config;

const validatePhoneNumber = (phone: string) => {
  // Validación de teléfono para diferentes países
  const countryRegex: { [key: string]: RegExp } = {
    '+593': /^\+593\d{9}$/,  // Ecuador
    '+1': /^\+1\d{10}$/,     // Estados Unidos
    '+51': /^\+51\d{9}$/,    // Perú
    '+57': /^\+57\d{10}$/,   // Colombia
    '+58': /^\+58\d{10}$/,   // Venezuela
  };

  const regex = Object.entries(countryRegex).find(([code]) => 
    phone.startsWith(code)
  )?.[1];

  // Si no hay una coincidencia para el código de país, se devuelve false
  if (!regex) {
    return false;
  }

  // Verifica que el número completo coincida con la expresión regular del país
  return regex.test(phone);
};

const createCustomer = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { company_name,company_ident, city, address, company_phone } = req.body;

  try {
    // Verificar que todos los parámetros requeridos estén presentes
    if (!company_name || !company_ident || !city || !address || !company_phone) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Faltan parametros para crear cliente',
        },
      });
    }
    
    if (!validatePhoneNumber(company_phone)) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'El número de teléfono no es válido o no tiene el formato correcto.',
        },
      });
    }
    // Buscar el usuario por ID
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Usuario no encontrado',
        },
      });
    }

    // Crear los datos del cliente
    const CustomerData = {
      company_name,
      company_ident,
      city,
      company_phone,
      address,
    };

    // Crear el nuevo cliente y asociarlo al usuario
    const newCustomer = await CustomerModel.create({
      ...CustomerData,
      userId: user.id,
    });

    // Actualizar el ID del cliente en el usuario
    await user.update({ customerId: newCustomer.id });

    const newUser = await UserModel.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
        },
      ],
    });

    const token = jwt.sign({ id: userId }, secret);

    return res.status(200).json({
      message: {
        type: 'success',
        msg: '¡Usuario registrado!',
      },
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const editCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { company_name, company_ident, company_phone, address, country, city } =
    req.body;

  try {
    const customerData: CustomerInterface = {
      company_name,
      company_ident,
      company_phone,
      address,
      country,
      city,
    };
    if (
      !company_name ||
      !company_ident ||
      !company_phone ||
      !address ||
      !country ||
      !city
    ) {
      return res.status(400).json({
        message: { type: 'error', msg: 'Faltan parametros' },
      });
    }
    await CustomerModel.update(customerData, {
      where: { id: customerId },
    });
    if (!validatePhoneNumber(company_phone)) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'El número de teléfono no es válido o no tiene el formato correcto.',
        },
      });
    }
    const customer = await CustomerModel.findByPk(customerId);
    res.status(200).json({
      message: {
        type: 'success',
        msg: 'Datos editados',
      },
      customer,
    });
  } catch (error) {
    console.log('ERROR: ', error);
    res.status(500).send(error);
  }
};

const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.findAll(); // Obtiene todos los registros de la tabla customers
    return res.status(200).json(customers); // Retorna los clientes en formato JSON
  } catch (error) {
    return res.status(500).send(error); // Maneja cualquier error que ocurra
  }
};

export default { createCustomer, editCustomer, getAllCustomers };
