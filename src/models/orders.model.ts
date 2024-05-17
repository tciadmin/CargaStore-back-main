import { DataTypes } from 'sequelize';
import db from '../db/connection';
//Carga
const Orders = db.define(
  'orders',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    picture: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    pick_up_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    pick_up_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pick_up_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pick_up_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivery_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    delivery_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delivery_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { updatedAt: false }
);

export default Orders;
