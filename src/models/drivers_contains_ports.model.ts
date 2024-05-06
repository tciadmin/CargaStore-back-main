import { DataTypes } from "sequelize";
import db from "../db/connection";
import Drivers from "./drivers.model";
import Ports from "./ports.model";
//Contienen (relacion entre driver y ports)
const DriversContainsPorts = db.define(
  "drivers_contains_port",
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
Drivers.hasMany(DriversContainsPorts); // Un conductor puede tener muchos permisos de puertos
Ports.hasOne(DriversContainsPorts); //Un permiso de puerto pertenece solo a un conductor
DriversContainsPorts.belongsTo(Drivers, { foreignKey: "driverId" }); //La relacion pertenece a un cliente
DriversContainsPorts.belongsTo(Ports, { foreignKey: "portId" }); //La relacion tiene un solo comentario

export default DriversContainsPorts;
