import { DataTypes } from "sequelize";
import db from "../db/connection";

const Feedbacks = db.define(
  "feedbacks",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  { updatedAt: false }
);

export default Feedbacks;
