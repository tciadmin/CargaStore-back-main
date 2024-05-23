import { Request, Response } from 'express';
import { CustomerModel, OrderModel, PackageModel } from '../models';
import { OrderInterface } from '../interface/order.interface';
import { PackageInterface } from '../interface/package.interface';
import { randomNumber } from '../utils/numberManager';

const createOrder = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const {
    product_name, //string
    quantity, //integer
    type, // 'Seca' | 'Peligrosa' | 'Refrigerada'
    weight, //float
    volume, //integer
    offered_price, //integer
    product_pic, //string
    receiving_company, //string
    contact_number, //integer
    receiving_company_RUC, //integer
    pick_up_date, //date
    pick_up_time, //string
    pick_up_address, //string
    pick_up_city, //string
    delivery_date, //date
    delivery_time, //string
    delivery_address, //string
    delivery_city, //string
  } = req.body;
  try {
    if (
      !product_name ||
      !quantity ||
      !type ||
      !weight ||
      !volume ||
      !offered_price ||
      !product_pic ||
      !receiving_company ||
      !contact_number ||
      !receiving_company_RUC ||
      !pick_up_date ||
      !pick_up_time ||
      !pick_up_address ||
      !pick_up_city ||
      !delivery_date ||
      !delivery_time ||
      !delivery_address ||
      !delivery_city
    ) {
      return res.status(404).json({ msg: 'Faltan parametros' });
    }
    const packageData: PackageInterface = {
      product_name,
      quantity,
      type,
      weight,
      volume,
      offered_price,
      product_pic,
    };
    const orderData: OrderInterface = {
      receiving_company,
      contact_number,
      receiving_company_RUC,
      pick_up_date,
      pick_up_time,
      pick_up_address,
      pick_up_city,
      delivery_date,
      delivery_time,
      delivery_address,
      delivery_city,
    };
    const customer = await CustomerModel.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ msg: 'Cliente no encontrado' });
    }
    const newPackage = await PackageModel.create(packageData);
    const order = await OrderModel.create({
      id: randomNumber(4),
      ...orderData,
      customerId: customer.id,
      customer: customer,
      packageId: newPackage.id,
      package: newPackage,
    });
    await customer.addOrder(order);
    return res
      .status(200)
      .json({ msg: 'Orden creada con exito!!', order });
  } catch (error) {
    res.status(500).send(error);
  }
};

const orderListWithFilter = async (req: Request, res: Response) => {
  const { status } = req.query; //pendiente | asignada | en curso | finalizada
  try {
    const allOrders = await OrderModel.findAll({
      where: { status: status },
      include: [
        { model: PackageModel, as: 'package' },
        { model: CustomerModel, as: 'customer' },
      ],
    });
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).send(error);
  }
};

export default { orderListWithFilter, createOrder };
