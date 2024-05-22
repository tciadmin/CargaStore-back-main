import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Order from './orders.model';
import Receivers from './receivers.model';
//Tiene (relacion entre order y receivers)
const OrdersHasReceivers = db.define(
  'orders_has_receivers',
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
Order.hasOne(OrdersHasReceivers); // Una orden tiene un destinatario
Receivers.hasOne(OrdersHasReceivers); //Un destinatario recibe una orden
OrdersHasReceivers.belongsTo(Order, { foreignKey: 'orderId' }); //La relacion pertenece a orders
OrdersHasReceivers.belongsTo(Receivers, { foreignKey: 'receiverId' }); //La relacion pertenece a receivers

export default OrdersHasReceivers;
