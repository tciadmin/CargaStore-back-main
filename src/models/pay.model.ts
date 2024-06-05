import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  AllowNull,
  Table,
} from "sequelize-typescript";
import Drivers from "./drivers.model";
import Customer from "./customers.model";
import Users from "./users.model";
import Order from "./orders.model";

export enum PayStatus {
  PENDIENTE = "pendiente",
  ACREDITADO = "acreditado",
}

@Table({ tableName: "pay", timestamps: false })
class Pay extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  total!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PayStatus),
    allowNull: false,
    defaultValue: PayStatus.PENDIENTE,
  })
  status!: PayStatus;

  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column(DataType.UUID)
  customerId!: string;

  @BelongsTo(() => Customer, { as: "customer_pay" })
  customer!: Customer;

  @ForeignKey(() => Drivers)
  @AllowNull(true)
  @Column(DataType.UUID)
  driverId!: string | null;
  @BelongsTo(() => Drivers, { as: "driver_pay" })
  driver!: Drivers;

  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;
  @BelongsTo(() => Users, { as: "users_pay" })
  user!: Users;

  @ForeignKey(() => Order)
  @Column({ type: DataType.BIGINT, allowNull: false })
  orderId!: string;

  @BelongsTo(() => Order)
  order!: Order;
}

export default Pay;
