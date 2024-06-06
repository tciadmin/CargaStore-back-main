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
  @Column({ type: DataType.UUID, allowNull: false })
  customerId!: string;

  @BelongsTo(() => Customer)
  customer!: Customer;

  @ForeignKey(() => Drivers)
  @Column({ type: DataType.UUID, allowNull: false })
  driverId!: string;

  @BelongsTo(() => Drivers)
  driver!: Drivers;

  @ForeignKey(() => Order)
  @Column({ type: DataType.BIGINT, allowNull: false })
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;
}

export default Pay;
