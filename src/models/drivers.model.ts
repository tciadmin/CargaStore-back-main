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
import Feedback from './feedbacks.model';
import Pay from './pay.model';

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
    allowNull: true,
  })
  picture!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  num_license!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  iess!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 5,
  })
  rating!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
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

  @HasMany(() => Pay)
  pays!: Pay[];

  @HasMany(() => Application)
  applications!: Application[];

  @HasMany(() => Order, { foreignKey: 'assignedDriverId' })
  assignedOrders!: Order[];

  @HasMany(() => Feedback)
  feedbacks!: Feedback[];

  async addOrder(feedbacks: Feedback): Promise<void> {
    if (!this.feedbacks) {
      this.feedbacks = [];
    }
    this.feedbacks.push(feedbacks);
    await this.save();
  }
}
