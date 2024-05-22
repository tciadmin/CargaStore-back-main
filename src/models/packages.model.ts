import {
  Model,
  Column,
  Table,
  DataType,
  PrimaryKey,
  HasOne,
  AllowNull,
  CreatedAt,
} from 'sequelize-typescript';
import Order from './orders.model';

interface PackageAttributes {
  id?: string;
  product_name: string;
  quantity: number;
  type: 'Seca' | 'Peligrosa' | 'Refrigerada';
  weight: number;
  volume: number;
  offered_price: number;
  product_pic: string;
  orderId?: string | undefined;
  order?: Order;
}

enum PackageType {
  SECA = 'Seca',
  PELIGROSA = 'Peligrosa',
  REFRIGERADA = 'Refrigerada',
}

@Table({ tableName: 'packages', timestamps: false })
class Package extends Model<PackageAttributes> {
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
  product_name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(PackageType),
    allowNull: false,
  })
  type!: PackageType;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  weight!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  volume!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  offered_price!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_pic!: string;

  @AllowNull(false)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @HasOne(() => Order, {
    foreignKey: 'orderId',
    as: 'package_order',
  })
  order!: Order;
}

export default Package;
