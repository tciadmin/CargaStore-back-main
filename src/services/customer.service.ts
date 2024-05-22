import { Request, Response } from 'express';
import { CustomerModel, UserModel } from '../models';

const createCustomer = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { company_name, cuit, company_phone } = req.body;
  try {
    if (!company_name || !cuit || !company_phone) {
      return res
        .status(400)
        .json({ msg: 'Faltan parametros para crear cliente' });
    }
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    const CustomerData = {
      company_name,
      cuit,
      company_phone,
    };
    const newCustomer = await CustomerModel.create({
      ...CustomerData,
      userId: user.id,
    });
    await user.update({ customerId: newCustomer.id });
    return res.status(200).json({
      msg: 'Cliente creado con éxito!!',
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { createCustomer };
