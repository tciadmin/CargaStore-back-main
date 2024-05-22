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
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

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
