import {
    Model,
    Table,
    Column,
    DataType,
    ForeignKey,
    PrimaryKey,
    AllowNull,
    BelongsTo,
  } from 'sequelize-typescript';
import Users from './users.model';

  
  interface ChatAttributes {
    id?: string;
    person1ID?: string;
    person2ID?: string;  
  }
  
  @Table({ tableName: 'chats', timestamps: false })
  export class Chat extends Model<ChatAttributes> {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    })
    id!: string;
    @ForeignKey(() => Users)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  person1ID!: number;

  @BelongsTo(() => Users,  'person1ID' )
  user!: Users;


  @ForeignKey(() => Users)
  @AllowNull(false)
  @Column(DataType.BIGINT)
  person2ID!: number;

  @BelongsTo(() => Users,  'person2ID' )
  user2!: Users;
  
    
  }
  
  export default Chat;
  