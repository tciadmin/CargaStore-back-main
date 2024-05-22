// import { DataTypes } from "sequelize";
// import db from "../db/connection";
// import { UserModel } from ".";

// const PasswordCodes = db.define(
//   "password_codes",
//   {
//     id: {
//       type: DataTypes.BIGINT,
//       primaryKey: true,
//       allowNull: false,
//       autoIncrement: true,
//     },
//     user_id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//     code: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: true,
//     },
//   },
//   {
//     updatedAt: false,
//   }
// );

// PasswordCodes.belongsTo(UserModel, {
//   foreignKey: "user_id",
//   as: "users_password_codes",
// });

// export default PasswordCodes;

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import Users from './users.model';

@Table({ tableName: 'password_codes', timestamps: false })
class PasswordCodes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  status!: boolean;

  @BelongsTo(() => Users, { as: 'users_password_codes' })
  user!: Users;
}

export default PasswordCodes;
