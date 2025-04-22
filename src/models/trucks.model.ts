import 'reflect-metadata';
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
  SECA = 'Seca',
  PELIGROSA = 'Peligrosa',
  REFRIGERADA = 'Refrigerada',
}

enum VehicleType {
  CAMION = 'Camión',
  CAMIONETA = 'Camioneta',
  TRAILER = 'Tráiler',
  PLATAFORMA = 'Plataforma',
  FURGON = 'Furgón',
  REFRIGERADO = 'Refrigerado',
  VOLQUETA = 'Volqueta',
  CISTERNA = 'Cisterna',
  PORTA_VEHICULOS = 'Porta vehículos',
  GONDOLA = 'Góndola',
  CAMA_BAJA = 'Cama baja',
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

  @Column({
    type: DataType.ENUM,
    values: Object.values(VehicleType),
    allowNull: false,
  })
  vehicle_type!: VehicleType;  

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true, // Esto significa que es opcional (si quieres que sea obligatorio, cambia a 'false')
  })
  hasGps!: boolean;

  @HasOne(() => Drivers, {
    foreignKey: 'DriverId',
    as: 'truck_driver',
  })
  driver!: Drivers;
}
export type { ChargeType };
export { VehicleType };
export default Truck;
