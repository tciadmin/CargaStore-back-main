import { Router } from 'express';
import { ApplicationServcie } from '../services';
// import ValidJWT from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const {
  applyForOrder,
  assignDriverToOrder,
  declineOrder,
  aceptOrder,
} = ApplicationServcie;

router.post(
  '/apply',
  // ValidJWT,
  applyForOrder
);

router.post(
  '/assign',
  // ValidJWT,
  assignDriverToOrder
);

router.patch(
  '/decline_order/:orderId',
  // ValidJWT,
  declineOrder
);

router.patch(
  '/acept_order/:orderId',
  // ValidJWT,
  aceptOrder
);

module.exports = router;
