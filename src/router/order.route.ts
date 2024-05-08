import { Router } from 'express';
import { OrderService } from '../services';
import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const {} = OrderService;

router.post('/create', validJwt);

router.get('/list_order', validJwt);

router.patch('/edit_order', validJwt);

// router.post("/resend_email", validJwt);

module.exports = router;
