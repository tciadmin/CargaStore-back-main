import { Router } from "express";
import { FeedbackService } from "../services";
import ValidJWT from "../middlewares/valid-jwt";

const router = Router();
//Servicios
const { createFeedback, getFeedbacks } = FeedbackService;

router.post("/create", ValidJWT, createFeedback);
router.get("/get/:userId", ValidJWT, getFeedbacks);

module.exports = router;
