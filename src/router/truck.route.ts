import { Router } from 'express';
import { TruckService } from '../services';
// import ValidJWT from "../middlewares/valid-jwt";

const router = Router();
//Servicios
const { patchTruck, getAllTrucks } = TruckService;

router.patch(
  '/update/:userId',
  //  ValidJWT,
  patchTruck
);
router.get(
  '/all',
  // ValidJWT,
  getAllTrucks
);

module.exports = router;
