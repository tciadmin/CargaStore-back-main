import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Drivers from './drivers.model';
import Order from './orders.model';

@Table({ tableName: 'applications', timestamps: false })
class Application extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

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

export default Application;
