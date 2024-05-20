//Archivo barril para exportar los modelos de la base de datos

<<<<<<< dev-deni
import Drivers from "./drivers.model";
import Users from "./users.model";
import Customers from "./customers.model";

//Ej: export { default as ParametersModel } from "./parametros.model";
// export { default as UserModel } from './users.model';
export { default as EmailCodesModel } from "./emailCodes.model";
export { default as PasswordCodesModel } from "./passwordCodes.model";
export { default as OrderModel } from "./orders.model";
// export { default as DriverModel } from './drivers.model';

Users.hasOne(Drivers, { foreignKey: "userId" });
Drivers.belongsTo(Users, { foreignKey: "userId" });

export {
  Users as UserModel,
  Drivers as DriverModel,
  Customers as CustomerModel,
};
=======
import Drivers from './drivers.model';
import Users from './users.model';

//Ej: export { default as ParametersModel } from "./parametros.model";
// export { default as UserModel } from './users.model';
export { default as EmailCodesModel } from './emailCodes.model';
export { default as PasswordCodesModel } from './passwordCodes.model';
export { default as OrderModel } from './orders.model';
// export { default as DriverModel } from './drivers.model';

Users.hasOne(Drivers, { foreignKey: 'userId' });
Drivers.belongsTo(Users, { foreignKey: 'userId' });

export { Users as UserModel, Drivers as DriverModel };
>>>>>>> development
