import { DataTypes } from "sequelize";
import db from "../db/connection";
import Drivers from "./drivers.model";
import Trucks from "./trucks.model";
//Usan (relacion entre driver y trucks)
const DriversUseTrucks = db.define(
  "drivers_use_trucks",
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
Drivers.hasOne(DriversUseTrucks); // Un conductor tiene un camion
Trucks.hasOne(DriversUseTrucks); //Un Camion tiene un conductor
DriversUseTrucks.belongsTo(Drivers, { foreignKey: "driverId" }); //La relacion pertenece a un conductor
DriversUseTrucks.belongsTo(Trucks, { foreignKey: "truckId" }); //La relacion pertenece a un camion

export default DriversUseTrucks;
