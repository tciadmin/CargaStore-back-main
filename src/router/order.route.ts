import { Router } from 'express';
import { OrderService } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { orderListWithFilter, createOrder } = OrderService;
router.post('/create/:customerId', createOrder);

router.get('/list_order', orderListWithFilter);

router.patch('/edit_order');

// router.post("/resend_email", validJwt);

module.exports = router;
