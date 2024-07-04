import { Router } from "express";
import { UserService } from "../services"; // Importa el servicio para obtener clientes y conductores
import ValidJWT from "../middlewares/valid-jwt";

const router = Router();

const { getAllCustomersAndDrivers, patchUser } = UserService;

router.get("/all", ValidJWT, getAllCustomersAndDrivers); // Ruta para obtener todos los clientes y conductores
router.put("/patchDataUser", ValidJWT, patchUser); // Ruta para obtener todos los clientes y conductores

module.exports = router;
