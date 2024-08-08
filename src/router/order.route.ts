import { Router } from 'express';
import { OrderService } from '../services';
import { uploadInvoice, uploadImages } from '../config/multerConfig';
// import ValidJWT from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const {
  findOrder,
  finishOrder,
  orderListWithFilter,
  createOrder,
  orderDetail,
  editOrder,
  duplicateOrder,
  addInvoiceToOrder,
  getOrderState,
  changeOrderState,
} = OrderService;

router.post(
  '/create/:customerId',
  // ValidJWT,
  uploadImages,
  createOrder
);

router.post(
  '/duplicate/:orderId',
  // ValidJWT,
  duplicateOrder
);

router.get(
  '/list_order',
  // ValidJWT,
  orderListWithFilter
);

router.get(
  '/detail/:orderId',
  // ValidJWT,
  orderDetail
);

router.put(
  '/edit/:orderId',
  // ValidJWT,
  uploadImages,
  editOrder
);

router.patch(
  '/finish/:orderId/:driverId',
  // ValidJWT,
  finishOrder
);

router.patch(
  '/add_invoice/:orderId',
  // ValidJWT,
  findOrder,
  uploadInvoice,
  addInvoiceToOrder
);

router.get(
  '/state/:orderId',
  // ValidJWT,
  getOrderState
);

router.patch(
  '/change_state/:orderId',
  //  ValidJWT,
  changeOrderState
);

router.post(
  '/resend_email'
  // ValidJWT
);

module.exports = router;
