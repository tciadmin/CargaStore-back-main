import { Router } from "express";
import { OrderService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { orderList } = OrderService;

router.post("/create");

router.get("/list_order", orderList);

router.patch("/edit_order");

// router.post("/resend_email", validJwt);

module.exports = router;
