import { DataTypes } from "sequelize";
import db from "../db/connection";
import Users from "./users.model";

const Admin = db.define(
  "admin",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
Admin.belongsTo(Users, { foreignKey: "userId" });

export default Admin;
