import { DataTypes } from "sequelize";
import db from "../db/connection";
import Drivers from "./drivers.model";
import Certificates from "./certificates.model";
//Poseen (relacion entre driver y certificates)
const DriversHaveCertificates = db.define(
  "drivers_have_certificates",
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
Drivers.hasMany(DriversHaveCertificates); // Un conductor tiene muchos certificados
Certificates.hasOne(DriversHaveCertificates); //Un certificado pertenece a un conductor
DriversHaveCertificates.belongsTo(Drivers, { foreignKey: "driversId" }); //La relacion pertenece a un conductor
DriversHaveCertificates.belongsTo(Certificates, {
  foreignKey: "certificatesId",
}); //La relacion pertenece a un Certificado

export default DriversHaveCertificates;
