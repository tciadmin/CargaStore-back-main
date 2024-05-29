import { Router } from "express";
import { OrderService } from "../services";
import { uploadInvoice } from "../config/multerConfig";
// import validJwt from '../middlewares/valid-jwt';
import path from "path";

const router = Router();
//Servicios
const {
  changeOrderStatus,
  orderListWithFilter,
  createOrder,
  orderDetail,
  editOrder,
  duplicateOrder,
  addInvoiceToOrder,
} = OrderService;

router.post("/create/:customerId", createOrder);

router.post("/duplicate/:orderId", duplicateOrder);

router.get("/list_order", orderListWithFilter);

router.get("/detail/:orderId", orderDetail);

router.put("/edit/:orderId", editOrder);

router.patch("/change_status/:orderId", changeOrderStatus);

// router.post("/resend_email", validJwt);

const { SERVER_URL } = process.env;

router.post("/invoice", async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: "No se ha subido ningún archivo" });
    }

    const invoicePath = req.file.path; // Ruta del archivo PDF de la factura
    const invoiceUrl = `${SERVER_URL}/${invoicePath}`; // URL completa del archivo de la factura

    // Llama a la función addInvoiceToOrder del servicio para asociar la factura a la orden
    const result = await addInvoiceToOrder({
      orderId: req.body.orderId,
      invoicePath,
    });

    res.status(200).json(result);
  } catch (error: any) {
    // Especifica el tipo de error como "any"
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
