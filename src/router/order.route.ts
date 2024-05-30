import { Router } from 'express';
import { OrderService } from '../services';
import { uploadInvoice } from '../config/multerConfig';
// import validJwt from '../middlewares/valid-jwt';
// import path from "path";

const router = Router();
//Servicios
const {
  findOrder,
  changeOrderStatus,
  orderListWithFilter,
  createOrder,
  orderDetail,
  editOrder,
  duplicateOrder,
  addInvoiceToOrder,
} = OrderService;

router.post('/create/:customerId', createOrder);

router.post('/duplicate/:orderId', duplicateOrder);

router.get('/list_order', orderListWithFilter);

router.get('/detail/:orderId', orderDetail);

router.put('/edit/:orderId', editOrder);

router.patch('/change_status/:orderId', changeOrderStatus);

router.patch(
  '/add_invoice/:orderId',
  findOrder,
  uploadInvoice,
  addInvoiceToOrder
);

// router.post("/resend_email", validJwt);

module.exports = router;
