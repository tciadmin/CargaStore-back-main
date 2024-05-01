import { DataTypes } from "sequelize";
import db from "../db/connection";
//Destinatario
const Receivers = db.define(
  "receivers",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { updatedAt: false }
);

export default Receivers;
