import { NextFunction, Request, Response } from 'express';
import {
  ApplicationModel,
  CustomerModel,
  DriverModel,
  OrderModel,
  PackageModel,
} from '../models';
import { OrderInterface } from '../interface/order.interface';
import { PackageInterface } from '../interface/package.interface';
import { randomNumber } from '../utils/numberManager';
//import { AddInvoice } from "../interface/addInvoice.interface";

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
    orderType, //'national' | 'international'
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
      !orderType ||
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
      orderType,
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
  const { status, orderType } = req.query; //pendiente | asignada | en curso | finalizada
  try {
    const allOrders = await OrderModel.findAll({
      where: { status: status, orderType: orderType },
      include: [
        { model: PackageModel, as: 'package' },
        { model: CustomerModel, as: 'customer' },
      ],
    });
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    res.status(500).send(error);
  }
};

const orderDetail = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findByPk(orderId, {
      include: [
        { model: PackageModel, as: 'package' },
        { model: CustomerModel, as: 'customer' },
        { model: ApplicationModel, include: [DriverModel] },
      ],
    });
    if (!order) {
      return res
        .status(404)
        .json({ msg: 'No se encuentra la orden' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const {
    orderType,
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
  } = req.body;
  try {
    const orderData: OrderInterface = {
      orderType,
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
    await OrderModel.update(orderData, { where: { id: orderId } });
    res.status(200).json({ msg: 'Orden editada con exito' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    if (!status) {
      return res.status(400).json({ msg: 'El estatus es requerido' });
    }
    await OrderModel.update({ status }, { where: { id: orderId } });
    res.status(200).json({ msg: 'Estado de orden cambiado' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const duplicateOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const originalOrder = await OrderModel.findByPk(orderId, {
      include: [{ model: PackageModel, as: 'package' }],
    });
    const originalPackage = await PackageModel.findByPk(
      originalOrder?.packageId
    );
    if (!originalOrder || !originalPackage) {
      return res
        .status(404)
        .json({ msg: 'No se ha encontrado la orden original' });
    }
    const duplicatePackage = await PackageModel.create({
      product_name: originalPackage.product_name,
      quantity: originalPackage.quantity,
      type: originalPackage.type,
      weight: originalPackage.weight,
      volume: originalPackage.volume,
      offered_price: originalPackage.offered_price,
      product_pic: originalPackage.product_pic,
    });
    const duplicateOrder = await OrderModel.create({
      orderType: originalOrder.orderType,
      receiving_company: originalOrder.receiving_company,
      contact_number: originalOrder.contact_number,
      receiving_company_RUC: originalOrder.receiving_company_RUC,
      pick_up_date: originalOrder.pick_up_date,
      pick_up_time: originalOrder.pick_up_time,
      pick_up_address: originalOrder.pick_up_address,
      pick_up_city: originalOrder.pick_up_city,
      delivery_date: originalOrder.delivery_date,
      delivery_time: originalOrder.delivery_time,
      delivery_address: originalOrder.delivery_address,
      delivery_city: originalOrder.delivery_city,
      customerId: originalOrder.customerId,
      packageId: duplicatePackage.id,
    });
    res.status(200).json({
      msg: 'Orden duplicada con exito',
      orden: duplicateOrder,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//agregar factura a orden

const addInvoiceToOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (!req.file) {
      return res.status(400).json({
        error:
          'El archivo no se subio o el tipo de archivo es incorrecto',
      });
    }

    // Actualizar la columna invoicePath con la ruta del archivo subido
    order.invoicePath = req.file.path;
    await order.save();

    res
      .status(200)
      .json({ message: 'Factura subida con exito', order });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

const findOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  findOrder,
  editOrder,
  orderListWithFilter,
  createOrder,
  orderDetail,
  changeOrderStatus,
  duplicateOrder,
  addInvoiceToOrder,
};
