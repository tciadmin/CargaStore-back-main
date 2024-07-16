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
import Customer from './customers.model';

@Table({ tableName: 'feedbacks', timestamps: true })
class Feedback extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  comment!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  score!: number;

  @ForeignKey(() => Drivers)
  @Column({ type: DataType.UUID, allowNull: false })
  driverId!: string;

  @BelongsTo(() => Drivers)
  driver!: Drivers;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.UUID, allowNull: false })
  customerId!: string;

  @BelongsTo(() => Customer)
  customer!: Customer;
}

export default Feedback;
