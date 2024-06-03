import { Router } from "express";
import { UserService } from "../services"; // Importa el servicio para obtener clientes y conductores

const router = Router();

const { getAllCustomersAndDrivers } = UserService; // Ruta para obtener todos los clientes y conductores

router.get("/all", getAllCustomersAndDrivers);

module.exports = router;
