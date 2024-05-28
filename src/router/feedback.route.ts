import { Router } from "express";
import { FeedbackService } from "../services";
// import validJwt from '../middlewares/valid-jwt';

const router = Router();
//Servicios
const { createFeedback, getFeedbacks } = FeedbackService;

router.post("/create", createFeedback);
router.get("/get/:userId", getFeedbacks);

module.exports = router;
