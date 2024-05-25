import { Router } from 'express';
import { ApplicationServcie } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { applyForOrder, assignDriverToOrder } = ApplicationServcie;

router.post('/apply', applyForOrder);

router.post('/assign', assignDriverToOrder);

module.exports = router;
