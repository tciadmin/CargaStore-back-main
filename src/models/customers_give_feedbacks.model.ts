import { DataTypes } from "sequelize";
import db from "../db/connection";
import Customers from "./customers.model";
import Feedbacks from "./feedbacks.model";
//Hacen (relacion entre customers y el feedback)
const CustomersGiveFeedbacks = db.define(
  "customers_give_feedbacks",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  { updatedAt: false }
);
// Establece la relaciónes
Customers.hasMany(CustomersGiveFeedbacks); // Un Cliente puede hacer muchos commentarios
Feedbacks.belongsTo(CustomersGiveFeedbacks); //Un comentario lo hace solo un Cliente
CustomersGiveFeedbacks.belongsTo(Customers, { foreignKey: "customerId" }); //La relacion pertenece a un cliente
CustomersGiveFeedbacks.belongsTo(Feedbacks, { foreignKey: "feedbackId" }); //La relacion tiene un solo comentario

export default CustomersGiveFeedbacks;
