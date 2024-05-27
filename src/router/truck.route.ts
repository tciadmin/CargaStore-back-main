import { Router } from "express";
import { TruckService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { patchTruck } = TruckService;

router.patch("/update/:userId", patchTruck);

module.exports = router;
