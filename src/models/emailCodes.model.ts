import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  CreatedAt,
} from 'sequelize-typescript';
import Users from './users.model';

@Table({ tableName: 'email_codes', timestamps: false })
class EmailCodes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  status!: boolean;

  @AllowNull(false)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;
}

export default EmailCodes;
