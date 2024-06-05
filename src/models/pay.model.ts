import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Users from "./users.model";
import Drivers from "./drivers.model";
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

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT, allowNull: false })
  userId!: number;

  @BelongsTo(() => Users)
  user!: Users;

  @ForeignKey(() => Drivers)
  @Column({ type: DataType.UUID, allowNull: true })
  driverId!: string | null;

  @BelongsTo(() => Drivers)
  driver!: Drivers;

  @ForeignKey(() => Order)
  @Column({ type: DataType.BIGINT, allowNull: false })
  orderId!: string;

  @BelongsTo(() => Order)
  order!: Order;
}

export default Pay;
