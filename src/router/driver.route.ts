import { Router } from "express";
import { DriverService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createDriver, getDriverByUserId, patchDriver } = DriverService;

router.post("/create/:userId", createDriver);
router.get("/get/:userId", getDriverByUserId);
router.patch("/patch/:userId", patchDriver);

module.exports = router;
