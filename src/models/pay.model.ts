import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Users from './users.model';
import Drivers from './drivers.model';

@Table({ tableName: 'pay', timestamps: false })
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

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT, allowNull: false })
  userId!: number;

  @BelongsTo(() => Users)
  user!: Users;

  @ForeignKey(() => Drivers)
  @Column({ type: DataType.UUID, allowNull: false })
  driverId!: number;

  @BelongsTo(() => Drivers)
  driver!: Drivers;
}

export default Pay;
