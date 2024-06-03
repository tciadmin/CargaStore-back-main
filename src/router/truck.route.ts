import { Router } from "express";
import { TruckService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { patchTruck, getAllTrucks } = TruckService;

router.patch("/update/:userId", patchTruck);
router.get("/all", getAllTrucks);

module.exports = router;
