import { Router } from 'express';
import { CustomerService } from '../services';
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createCustomer, editCustomer } = CustomerService;

router.post('/create/:userId', createCustomer);

router.put('/edit/:customerId', editCustomer);

module.exports = router;
