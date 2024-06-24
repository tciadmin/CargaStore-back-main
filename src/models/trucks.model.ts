import {
  DataType,
  PrimaryKey,
  Table,
  Column,
  Model,
  HasOne,
} from 'sequelize-typescript';
import { TruckInterface } from '../interface/truck.interface';
import Drivers from './drivers.model';

enum ChargeType {
  SECA = 'seca',
  PELIGROSA = 'peligrosa',
  REFRIGERADA = 'refrigerada',
}

@Table({ tableName: 'trucks', timestamps: false })
class Truck extends Model<TruckInterface> {
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
  brand!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  model!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ChargeType),
    allowNull: false,
  })
  charge_type!: ChargeType;

  @Column({ type: DataType.STRING, allowNull: false })
  charge_capacity!: string;

  @Column({ type: DataType.STRING, allowNull: true }) // Agregado: num_plate
  num_plate!: string;

  @HasOne(() => Drivers, {
    foreignKey: 'DriverId',
    as: 'truck_driver',
  })
  driver!: Drivers;
}
export type { ChargeType };
export default Truck;
