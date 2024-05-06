import { DataTypes } from "sequelize";
import db from "../db/connection";
//Paquete
const Packages = db.define(
  "packages",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offered_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_pic: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  { updatedAt: false }
);

export default Packages;
