import { Router } from "express";
import { PayService } from "../services";

const router = Router();
//Servicios
const {
  payDriver,
  adminHistoryPay,
  driverHistoryPay,
  payListWithFilter,
  findPay,
} = PayService;

router.post("/pay_driver", payDriver); //Esta ruta es para efectuar un pago del admin al conductor

router.get("/admin_history/:userId", adminHistoryPay);

router.get("/driver_history/:driverId", driverHistoryPay);

router.get("/list_pays", payListWithFilter); // filtra los pagos en pendientes o acreditados

router.get("/find_pay/:payId", findPay); //Trae los detalles de un pago para vista admin

module.exports = router;
