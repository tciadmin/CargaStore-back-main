import { Router } from 'express';
import { PayService } from '../services';

const router = Router();
//Servicios
const { payDriver, adminHistoryPay, driverHistoryPay } = PayService;

router.post('/pay_driver', payDriver); //Esta ruta es para efectuar un pago del admin al conductor

router.get('/admin_history/:userId', adminHistoryPay);

router.get('/driver_history/:driverId', driverHistoryPay);

module.exports = router;
