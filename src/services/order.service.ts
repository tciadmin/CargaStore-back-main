import { NextFunction, Request, Response } from 'express';
import {
  ApplicationModel,
  CustomerModel,
  DriverModel,
  OrderModel,
  PackageModel,
  TruckModel,
  UserModel,
} from '../models';
import { OrderInterface } from '../interface/order.interface';
import { PackageInterface } from '../interface/package.interface';
import { randomNumber } from '../utils/numberManager';
import { OrderStatus } from '../models/orders.model';
import { isMulterRequestFiles } from '../config/multerConfig';
import { WhereOptions, Op } from 'sequelize';
import fs from 'fs';

//import { AddInvoice } from "../interface/addInvoice.interface";

const createOrder = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  if (!isMulterRequestFiles(req.files)) {
    console.log('error al subir los archivos: ', req.files);
    return res.status(400).json({
      message: {
        type: 'error',
        msg: 'Error al subir los archivos',
      },
    });
  }
  const files = req.files;
  console.log('files: ', files);
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const {
    product_name, //string
    quantity, //integer
    type, // 'Seca' | 'Peligrosa' | 'Refrigerada'
    weight, //string
    volume, //string
    offered_price, //string
    orderType, //'nacional' | 'internacional'
    receiving_company, //string
    contact_number, //integer
    receiving_company_RUC, //integer
    pick_up_date, //date
    pick_up_time, //string
    pick_up_address, //string
    delivery_date, //date
    delivery_time, //string
    delivery_address, //string
  } = req.body;
  try {
    if (
      !product_name ||
      !quantity ||
      !type ||
      !weight ||
      !volume ||
      !offered_price ||
      !receiving_company ||
      !orderType ||
      !contact_number ||
      !receiving_company_RUC ||
      !pick_up_date ||
      !pick_up_time ||
      !pick_up_address ||
      !delivery_date ||
      !delivery_time ||
      !delivery_address
    ) {
      console.log('faltan parametros');
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Faltan parametros',
        },
      });
    }
    const packageData: PackageInterface = {
      product_name,
      image1: files?.image1 ? files.image1[0].path : null,
      image2: files?.image2 ? files.image2[0].path : null,
      image3: files?.image3 ? files.image3[0].path : null,
      image4: files?.image4 ? files.image4[0].path : null,
      quantity,
      type,
      weight,
      volume,
      offered_price,
    };
    const orderData: OrderInterface = {
      orderType,
      receiving_company,
      contact_number,
      receiving_company_RUC,
      pick_up_date,
      pick_up_time,
      pick_up_address,
      delivery_date,
      delivery_time,
      delivery_address,
    };
    const customer = await CustomerModel.findByPk(customerId);
    if (!customer) {
      console.log('cliente no encontrado');
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Cliente no encontrado',
        },
      });
    }
    const newPackage = await PackageModel.create(packageData);
    const order = await OrderModel.create({
      id: randomNumber(5),
      ...orderData,
      customerId: customer.id,
      customer: customer,
      packageId: newPackage.id,
      package: newPackage,
    });
    await customer.addOrder(order);
    return res.status(200).json({
      message: {
        type: 'success',
        msg: 'Orden creada con exito!!',
        order,
      },
    });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).send(error);
  }
};

const orderListWithFilter = async (req: Request, res: Response) => {
  const {
    status,
    orderType,
    customerId,
    pendingAssignedDriverId,
    assignedDriverId,
  } = req.query as {
    status?: string; //pendiente | asignada | en curso | finalizada
    orderType?: string;
    customerId?: string;
    pendingAssignedDriverId?: string;
    assignedDriverId?: string;
  };
  const whereConditions: WhereOptions = {};
  if (status) whereConditions.status = status;
  if (orderType) whereConditions.orderType = orderType;
  if (customerId) whereConditions.customerId = customerId;
  if (pendingAssignedDriverId)
    whereConditions.pendingAssignedDriverId = pendingAssignedDriverId;
  if (assignedDriverId)
    whereConditions.assignedDriverId = assignedDriverId;
  try {
    const allOrders = await OrderModel.findAll({
      where: whereConditions,
      attributes: {
        exclude: ['contact_number', 'receiving_company_RUC'],
      },
      include: [
        {
          model: PackageModel,
          as: 'package',
          attributes: [
            'image1',
            'product_name',
            'offered_price',
            'type',
            'weight',
          ],
        },
        {
          model: CustomerModel,
          as: 'customer',
          attributes: ['country'],
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: ['name', 'lastname'],
            },
          ],
        },
        {
          model: ApplicationModel,
          attributes: ['id'],
        },
        {
          model: DriverModel,
          as: 'assignedDriver',
          attributes: ['num_license', 'rating'],
          include: [
            {
              model: UserModel,
              as: 'user_driver',
              attributes: ['id', 'name', 'lastname', 'profile_image'],
            },
            {
              model: TruckModel,
              as: 'truck',
              attributes: [
                'charge_capacity',
                'brand',
                'model',
                'num_plate',
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send(error);
  }
};

const orderDetail = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await OrderModel.findByPk(orderId, {
      include: [
        { model: PackageModel, as: 'package' },
        {
          model: CustomerModel,
          as: 'customer',
          include: [
            {
              model: UserModel,
              as: 'user',
              attributes: {
                exclude: ['password'],
              },
            },
          ],
        },
        {
          model: DriverModel,
          as: 'assignedDriver',
          attributes: ['num_license', 'rating'],
          include: [
            {
              model: UserModel,
              as: 'user_driver',
              attributes: ['name', 'lastname', 'profile_image'],
            },
            {
              model: TruckModel,
              as: 'truck',
            },
          ],
        },
        {
          model: ApplicationModel,
          include: [
            {
              model: DriverModel,
              as: 'driver',
              attributes: ['rating'],
              include: [
                {
                  model: UserModel,
                  as: 'user_driver',
                  attributes: ['name', 'lastname', 'profile_image'],
                },
                {
                  model: TruckModel,
                  as: 'truck',
                  attributes: {
                    exclude: ['year', 'num_plate'],
                  },
                },
              ],
            },
          ],
        },
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
    product_name, //string
    quantity, //integer
    type, // 'Seca' | 'Peligrosa' | 'Refrigerada'
    weight, //string
    volume, //string
    offered_price, //string
    orderType, //'national' | 'international'
    receiving_company, //string
    contact_number, //integer
    receiving_company_RUC, //integer
    pick_up_date, //date
    pick_up_time, //string
    pick_up_address, //string
    delivery_date, //date
    delivery_time, //string
    delivery_address, //string
  } = req.body;
  const files = req.files;
  try {
    const order = await OrderModel.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        message: {
          type: 'error',
          msg: 'Orden no encontrada',
        },
      });
    }
    if (!isMulterRequestFiles(files)) {
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Error al subir los archivos',
        },
      });
    }

    const single_package = await PackageModel.findByPk(
      order.packageId
    );
    const packageData: PackageInterface = {
      image1: files.image1
        ? files.image1[0].path
        : single_package?.image1,
      image2: files.image2
        ? files.image2[0].path
        : single_package?.image2,
      image3: files.image3
        ? files.image3[0].path
        : single_package?.image3,
      image4: files.image4
        ? files.image4[0].path
        : single_package?.image4,
      product_name,
      quantity,
      type,
      weight,
      volume,
      offered_price,
    };
    const orderData: OrderInterface = {
      orderType,
      receiving_company,
      contact_number,
      receiving_company_RUC,
      pick_up_date,
      pick_up_time,
      pick_up_address,
      delivery_date,
      delivery_time,
      delivery_address,
    };
    const packageImage1 = await PackageModel.findOne({
      where: {
        image1: single_package?.image1,
        id: { [Op.ne]: single_package?.id },
      },
    });
    const packageImage2 = await PackageModel.findOne({
      where: {
        image2: single_package?.image2,
        id: { [Op.ne]: single_package?.id },
      },
    });
    const packageImage3 = await PackageModel.findOne({
      where: {
        image3: single_package?.image3,
        id: { [Op.ne]: single_package?.id },
      },
    });
    const packageImage4 = await PackageModel.findOne({
      where: {
        image4: single_package?.image4,
        id: { [Op.ne]: single_package?.id },
      },
    });
    if (!packageImage1) {
      single_package?.image1 && fs.unlinkSync(single_package.image1);
    }
    if (!packageImage2) {
      single_package?.image2 && fs.unlinkSync(single_package.image2);
    }
    if (!packageImage3) {
      single_package?.image3 && fs.unlinkSync(single_package.image3);
    }
    if (!packageImage4) {
      single_package?.image4 && fs.unlinkSync(single_package.image4);
    }
    await PackageModel.update(packageData, {
      where: { id: order.packageId },
    });
    await OrderModel.update(orderData, { where: { id: orderId } });
    res.status(200).json({
      message: {
        type: 'success',
        msg: 'Tu orden ha sido editada',
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const finishOrder = async (req: Request, res: Response) => {
  const { orderId, driverId } = req.params;
  try {
    const order = await OrderModel.findByPk(orderId);
    const driver = await DriverModel.findByPk(driverId);
    if (!order) {
      console.log('orden no encontrada');
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }
    if (order.status !== 'en curso') {
      console.log('no puedes dar por finalizada esta orden');
      return res
        .status(400)
        .json({ msg: 'No puedes dar por finalizada esta orden' });
    }
    if (!driver) {
      console.log('conductor no encontrado');
      return res.status(404).json({ msg: 'Conductor no encontrado' });
    }
    order.status = OrderStatus.FINALIZADO;
    await order.save();
    await driver.update({ order_count: driver.order_count + 1 });
    res
      .status(200)
      .json({ msg: 'Orden finalizada', orderStatus: order.status });
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
      image1: originalPackage.image1,
      image2: originalPackage.image2,
      image3: originalPackage.image3,
      image4: originalPackage.image4,
      quantity: originalPackage.quantity,
      type: originalPackage.type,
      weight: originalPackage.weight,
      volume: originalPackage.volume,
      offered_price: originalPackage.offered_price,
    });
    const duplicateOrder = await OrderModel.create({
      orderType: originalOrder.orderType,
      receiving_company: originalOrder.receiving_company,
      contact_number: originalOrder.contact_number,
      receiving_company_RUC: originalOrder.receiving_company_RUC,
      pick_up_date: originalOrder.pick_up_date,
      pick_up_time: originalOrder.pick_up_time,
      pick_up_address: originalOrder.pick_up_address,
      delivery_date: originalOrder.delivery_date,
      delivery_time: originalOrder.delivery_time,
      delivery_address: originalOrder.delivery_address,
      customerId: originalOrder.customerId,
      packageId: duplicatePackage.id,
    });
    res.status(200).json({
      message: {
        type: 'success',
        msg: 'Orden duplicada con exito',
      },
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

const getOrderState = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId, {
      attributes: [
        'enPreparacion',
        'preparado',
        'retirado',
        'enCamino',
      ],
    });
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }
    res.status(200).json({ orderState: order });
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeOrderState = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findByPk(orderId, {
      attributes: [
        'id',
        'status',
        'enPreparacion',
        'preparado',
        'retirado',
        'enCamino',
      ],
    });
    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }
    if (!order.enPreparacion) {
      order.enPreparacion = new Date();
      order.status = OrderStatus.ENCURSO;
      await order.save();
      return res.status(200).json({ orderState: order });
    } else if (!order.preparado) {
      order.preparado = new Date();
      await order.save();
      return res.status(200).json({ orderState: order });
    } else if (!order.retirado) {
      order.retirado = new Date();
      await order.save();
      return res.status(200).json({ orderState: order });
    } else if (!order.enCamino) {
      order.enCamino = new Date();
      await order.save();
      return res.status(200).json({ orderState: order });
    } else {
      return res.status(401).json({
        msg: 'Los cuatro estados de la orden estan completos',
        orderState: order,
      });
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
  finishOrder,
  duplicateOrder,
  addInvoiceToOrder,
  getOrderState,
  changeOrderState,
};
