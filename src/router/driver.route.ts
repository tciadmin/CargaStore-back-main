import { Router } from 'express';
import { DriverService } from '../services';
import ValidJWT from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createDriver, getDriverByUserId, patchDriver } =
  DriverService;

router.post(
  '/create/:userId',
  //  ValidJWT,
  createDriver
);
router.get('/get/:userId', ValidJWT, getDriverByUserId);
router.patch('/patch/:userId', ValidJWT, patchDriver);

module.exports = router;
