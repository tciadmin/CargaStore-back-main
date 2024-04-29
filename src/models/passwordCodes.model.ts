import { DataTypes } from "sequelize";
import db from "../db/connection";
import { UserModel } from ".";

const PasswordCodes = db.define(
  "password_codes",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    updatedAt: false,
  }
);

PasswordCodes.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "users_password_codes",
});

export default PasswordCodes;
