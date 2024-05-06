import { DataTypes } from "sequelize";
import db from "../db/connection";

const Certificates = db.define(
  "certificates",
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

export default Certificates;
