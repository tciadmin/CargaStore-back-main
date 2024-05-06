import { DataTypes } from "sequelize";
import db from "../db/connection";

const Trucks = db.define(
  "trucks",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_plate: {
      type: DataTypes.STRING, //Puede contener letras
      allowNull: false,
    },
    exp_plate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_cargo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mech_inspection: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    policy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },

  { updatedAt: false }
);

export default Trucks;
