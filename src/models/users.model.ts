import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
} from 'sequelize-typescript';
import Drivers from './drivers.model';
import Customer from './customers.model';
// import Pay from "./pay.model";

export enum RoleType {
  ADMIN = 'admin',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
}

@Table({ tableName: 'users', timestamps: false })
class Users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(RoleType),
    allowNull: true,
  })
  role!: RoleType | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  verified_email!: boolean;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  status!: boolean;

  @HasOne(() => Drivers, {
    foreignKey: 'userId',
    as: 'user_driver',
  })
  driver!: Drivers;

  @HasOne(() => Customer, {
    foreignKey: 'userId',
    as: 'user_customer',
  })
  customer!: Customer;
}

export default Users;
