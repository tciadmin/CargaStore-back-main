import { DataTypes } from "sequelize";
import db from "../db/connection";
import Orders from "./orders.model";
import Packages from "./packages.model";
//Transporta (relacion entre order y packages)
const OrdersTransportsPackages = db.define(
  "orders_transports_packages",
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
Orders.hasOne(OrdersTransportsPackages); // Una orden tiene un paquete
Packages.hasOne(OrdersTransportsPackages); //Un paquete va en una orden
OrdersTransportsPackages.belongsTo(Orders, { foreignKey: "orderId" }); //La relacion pertenece a orders
OrdersTransportsPackages.belongsTo(Packages, { foreignKey: "packageId" }); //La relacion pertenece a package

export default OrdersTransportsPackages;
