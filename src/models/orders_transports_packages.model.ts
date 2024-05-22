import { DataTypes } from 'sequelize';
import db from '../db/connection';
import Order from './orders.model';
import Package from './packages.model';
//Transporta (relacion entre order y packages)
const OrdersTransportsPackages = db.define(
  'orders_transports_packages',
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
Order.hasOne(OrdersTransportsPackages); // Una orden tiene un paquete
Package.hasOne(OrdersTransportsPackages); //Un paquete va en una orden
OrdersTransportsPackages.belongsTo(Order, { foreignKey: 'orderId' }); //La relacion pertenece a orders
OrdersTransportsPackages.belongsTo(Package, {
  foreignKey: 'packageId',
}); //La relacion pertenece a package

export default OrdersTransportsPackages;
