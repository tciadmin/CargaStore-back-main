dev-deni
import { Router } from "express";
import { OrderService } from "../services";

import { Router } from 'express';
import { OrderService } from '../services';
development
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { orderList } = OrderService;

dev-deni
router.post("/create");

router.get("/list_order", orderList);

router.patch("/edit_order");

router.post('/create');

router.get('/list_order', orderList);

router.patch('/edit_order');
development

// router.post("/resend_email", validJwt);

module.exports = router;
