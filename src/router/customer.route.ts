import { Router } from 'express';
import { CustomerService } from '../services';
import ValidJWT from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createCustomer, editCustomer } = CustomerService;

router.post('/create/:userId', ValidJWT, createCustomer);

router.put('/edit/:customerId', ValidJWT, editCustomer);

module.exports = router;
