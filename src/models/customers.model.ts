import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import Order from './orders.model';
import Users from './users.model';
import Feedback from './feedbacks.model';

interface CustomerAttributes {
  id?: string;
  company_name: string;
  ruc?: number;
  company_phone: string;
  address: string;
  country?: string;
  city: string;
  userId?: number;
}

@Table({ tableName: 'customers', timestamps: false })
export class Customer extends Model<CustomerAttributes> {
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
  company_name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  ruc!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  company_phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city!: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => Users)
  user!: Users;

  @HasMany(() => Order)
  orders!: Order[];

  @HasMany(() => Feedback)
  feedbacks!: Feedback[];

  async addOrder(order: Order): Promise<void> {
    if (!this.orders) {
      this.orders = [];
    }
    this.orders.push(order);
    await this.save();
  }
}

export default Customer;
