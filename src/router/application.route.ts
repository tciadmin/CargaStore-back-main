import { Router } from 'express';
import { ApplicationServcie } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const {
  applyForOrder,
  assignDriverToOrder,
  declineOrder,
  aceptOrder,
} = ApplicationServcie;

router.post('/apply', applyForOrder);

router.post('/assign', assignDriverToOrder);

router.patch('/decline_order/:orderId', declineOrder);

router.patch('/acept_order/:orderId', aceptOrder);

module.exports = router;
