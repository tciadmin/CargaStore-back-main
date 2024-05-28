import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';
import Users from './users.model';
import Truck from './trucks.model';
import Application from './application.model';
import Order from './orders.model';

@Table({ tableName: 'drivers', timestamps: false })
export default class Drivers extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  picture!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  num_license!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  iess!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  phone!: number;

  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;

  @BelongsTo(() => Users, { as: 'user_driver' })
  user!: Users;

  @ForeignKey(() => Truck)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  truckId!: string;

  @BelongsTo(() => Truck)
  truck!: Truck;

  @HasMany(() => Application)
  applications!: Application[];

  @HasMany(() => Order, { foreignKey: 'assignedDriverId' })
  assignedOrders!: Order[];
}
