import { DataTypes } from "sequelize";
import db from "../db/connection";
//Permisos puerto
const Ports = db.define(
  "ports",
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

export default Ports;
