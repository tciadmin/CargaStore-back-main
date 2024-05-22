import { Router } from 'express';
import { DriverService } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createDriver } = DriverService;

router.post('/create/:userId', createDriver);

module.exports = router;
