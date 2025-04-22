import 'reflect-metadata';
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
  CreatedAt,
  BeforeSave,
} from 'sequelize-typescript';
import Users from './users.model';
import Truck from './trucks.model';
import Application from './application.model';
import Order from './orders.model';
import Feedback from './feedbacks.model';
import Pay from './pay.model';
import { isValidPhoneNumber } from 'libphonenumber-js';

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
    type: DataType.INTEGER,
    allowNull: true,
  })
  num_license!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  iess!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pdf_iess!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  port_permit!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pdf_port_permit!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  insurance_policy!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  img_insurance_policy!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  img_driver_license!: string;

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
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  identification!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  order_count!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  feedback_count!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  validate_by_admin!: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

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

  @BeforeSave
  static validateFullPhoneNumber(instance: Drivers) {
    if (instance.phone && !isValidPhoneNumber(instance.phone)) {
     throw new Error('Número de teléfono no válido');
    }
  }
  async addOrder(feedbacks: Feedback): Promise<void> {
    if (!this.feedbacks) {
      this.feedbacks = [];
    }
    this.feedbacks.push(feedbacks);
    await this.save();
  }
}
