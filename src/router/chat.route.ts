import { Router } from 'express';
import ValidJWT from '../middlewares/valid-jwt';
import chatService from '../services/chat.service';

const router = Router();
//Servicios
const { createNewChat } = chatService;

router.post(
  '/create/',
  ValidJWT,
  createNewChat
);


module.exports = router;