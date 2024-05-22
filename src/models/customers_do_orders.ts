import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Customer from './customers.model';
import Order from './orders.model';
//Hacen (relacion entre customers y el feedback)
const CustomersDoOrders = db.define(
  'customers_do_orders',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { updatedAt: false }
);
// Establece la relaciónes
Customer.hasMany(CustomersDoOrders); // Un Cliente puede hacer muchos commentarios
Order.belongsTo(CustomersDoOrders); //Un comentario lo hace solo un Cliente
CustomersDoOrders.belongsTo(Customer, { foreignKey: 'customerId' }); //La relacion pertenece a un cliente
CustomersDoOrders.belongsTo(Order, { foreignKey: 'orderId' }); //La relacion tiene un solo comentario

export default { CustomersDoOrders };
