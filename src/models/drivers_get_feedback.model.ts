import { DataTypes } from "sequelize";
import db from "../db/connection";
import Drivers from "./drivers.model";
import Feedbacks from "./feedbacks.model";
//Obtienen (relacion entre driver y el feedback)
const DriversGetFeedbacks = db.define(
  "drivers_get_feedbacks",
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
Drivers.hasMany(DriversGetFeedbacks); // Un driver puede tener muchos commentarios
Feedbacks.belongsTo(DriversGetFeedbacks); //Un comentario es hacia solo un contuctor
DriversGetFeedbacks.belongsTo(Drivers, { foreignKey: "driverId" }); //La relacion pertenece a un conductor
DriversGetFeedbacks.belongsTo(Feedbacks, { foreignKey: "feedbackId" }); //La relacion pertenece a feedback

export default DriversGetFeedbacks;
