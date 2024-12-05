import 'reflect-metadata';
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
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  quantity: number;
  type: 'seca' | 'peligrosa' | 'refrigerada';
  weight: string;
  volume: string;
  offered_price: string;
  orderId?: string | undefined;
  order?: Order;
}

enum PackageType {
  SECA = 'seca',
  PELIGROSA = 'peligrosa',
  REFRIGERADA = 'refrigerada',
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
    type: DataType.STRING,
    allowNull: true,
  })
  image1!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image2!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image3!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image4!: string;

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
    type: DataType.STRING,
    allowNull: false,
  })
  weight!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  volume!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  offered_price!: string;

  @AllowNull(false)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @HasOne(() => Order, {
    foreignKey: 'packageId',
    as: 'package_order',
  })
  order!: Order;
}

export default Package;
