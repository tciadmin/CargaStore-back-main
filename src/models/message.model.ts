import {
    Model,
    Table,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
    PrimaryKey,
    AllowNull,
  } from 'sequelize-typescript';
import Users from './users.model';
import { ChatModel } from '.';

  
  interface MessageAttributes {
    id?: string;
    chatID?: string;
    emisorID?: number;  
    image?: string;
    message?: string;
    datetime?: Date;
  }
  
  @Table({ tableName: 'messages', timestamps: true })
  export class Message extends Model<MessageAttributes> {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
      allowNull: false,
    })
    id!: string;

    @ForeignKey(() => ChatModel)
    @AllowNull(false)
    @Column(DataType.UUIDV4)
    chatID!: string;

    @BelongsTo(() => ChatModel,  'chatID' )
    chat!: ChatModel;



    @Column({
        type: DataType.STRING,
        allowNull: false,
      })
      message!: string;
  
    @Column({
        type: DataType.STRING,
        allowNull: true,
      })
      image!: string;

      

    @ForeignKey(() => Users)
    @AllowNull(false)
    @Column(DataType.BIGINT)
    emisorID!: number;

    @BelongsTo(() => Users,  'emisorID' )
    user!: Users;
  }
  
  export default Message;
  