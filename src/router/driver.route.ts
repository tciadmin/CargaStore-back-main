<<<<<<< dev-deni
import { Router } from "express";
import { DriverService } from "../services";
=======
import { Router } from 'express';
import { DriverService } from '../services';
>>>>>>> development
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createDriver } = DriverService;

<<<<<<< dev-deni
router.post("/create/:userId", createDriver);
=======
router.post('/create/:userId', createDriver);
>>>>>>> development

module.exports = router;
