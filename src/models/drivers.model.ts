import { DataTypes } from "sequelize";
import db from "../db/connection";
import Users from "./users.model";

const Drivers = db.define(
  "drivers",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    picture: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    num_license: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exp_license: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    iess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Users,
        key: "id",
      },
    },
  },
  { updatedAt: false }
);
// Establece la relación entre Driver y User
Drivers.belongsTo(Users, { foreignKey: "userId" });

export default Drivers;
