import { DataTypes } from "sequelize";
import db from "../db/connection";
import Customers from "./customers.model";
import Orders from "./orders.model";
//Hacen (relacion entre customers y el feedback)
const CustomersDoOrders = db.define(
  "customers_do_orders",
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
Customers.hasMany(CustomersDoOrders); // Un Cliente puede hacer muchos commentarios
Orders.belongsTo(CustomersDoOrders); //Un comentario lo hace solo un Cliente
CustomersDoOrders.belongsTo(Customers, { foreignKey: "customerId" }); //La relacion pertenece a un cliente
CustomersDoOrders.belongsTo(Orders, { foreignKey: "orderId" }); //La relacion tiene un solo comentario

export default { CustomersDoOrders };
