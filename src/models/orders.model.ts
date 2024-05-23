import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
} from 'sequelize-typescript';
import Package from './packages.model';
import Customer from './customers.model';

enum OrderStatus {
  PENDIENTE = 'pendiente',
  ASIGNADO = 'asignado',
  ENCURSO = 'en curso',
  FINALIZADO = 'finalizado',
}

@Table({ tableName: 'orders', timestamps: false })
class Order extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  id!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(OrderStatus),
    allowNull: false,
    defaultValue: 'pendiente',
  })
  status!: OrderStatus;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  receiving_company!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  contact_number!: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  receiving_company_RUC!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  pick_up_date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pick_up_time!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pick_up_address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pick_up_city!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  delivery_date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  delivery_time!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  delivery_address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  delivery_city!: string;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  customerId!: string;

  @BelongsTo(() => Customer)
  customer!: Customer;

  @ForeignKey(() => Package)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  packageId!: string;

  @BelongsTo(() => Package)
  package!: Package;

  async setPackage(newPackage: Package): Promise<void> {
    this.packageId = newPackage.id;
    this.package = newPackage;
    await this.save();
  }
}

export default Order;
