import { Router } from "express";
import { DriverService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createDriver, getDriverByUserId } = DriverService;

router.post("/create/:userId", createDriver);
router.get("/get/:userId", getDriverByUserId);

module.exports = router;
