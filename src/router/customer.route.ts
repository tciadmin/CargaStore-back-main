import { Router } from "express";
import { CustomerService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createCustomer } = CustomerService;

router.post("/create/:userId", createCustomer);

module.exports = router;
