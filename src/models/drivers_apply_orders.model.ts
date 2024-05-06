import { DataTypes } from "sequelize";
import db from "../db/connection";
import Drivers from "./drivers.model";
import Orders from "./orders.model";
//se_postulan (relacion entre driver y el order)
const DriversApplyOrders = db.define(
  "drivers_apply_orders",
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
Drivers.hasMany(DriversApplyOrders); // Un conductor puede tener muchas ordenes
Orders.hasOne(DriversApplyOrders); //Una orden tiene solo un contuctor
DriversApplyOrders.belongsTo(Drivers, { foreignKey: "driverId" }); //La relacion pertenece a un conductor
DriversApplyOrders.belongsTo(Orders, { foreignKey: "orderId" }); //La relacion pertenece a order

export default DriversApplyOrders;
