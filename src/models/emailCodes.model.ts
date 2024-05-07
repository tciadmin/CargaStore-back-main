import { DataTypes } from "sequelize";
import db from "../db/connection";
import Users from "./users.model";
import { CreatedAt } from "sequelize-typescript";

const EmailCodes = db.define(
  "email_codes",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  }
);

EmailCodes.belongsTo(Users, {
  foreignKey: "user_id",
  as: "email_code_user",
});

export default EmailCodes;
