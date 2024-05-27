import { Router } from 'express';
import { OrderService } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const {
  changeOrderStatus,
  orderListWithFilter,
  createOrder,
  orderDetail,
  editOrder,
  duplicateOrder,
} = OrderService;

router.post('/create/:customerId', createOrder);

router.post('/duplicate/:orderId', duplicateOrder);

router.get('/list_order', orderListWithFilter);

router.get('/detail/:orderId', orderDetail);

router.put('/edit/:orderId', editOrder);

router.patch('/change_status/:orderId', changeOrderStatus);

// router.post("/resend_email", validJwt);

module.exports = router;
