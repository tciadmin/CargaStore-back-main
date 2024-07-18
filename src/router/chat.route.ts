import { Router } from 'express';
import ValidJWT from '../middlewares/valid-jwt';
import chatService from '../services/chat.service';

const router = Router();
//Servicios
const { createNewChat, getAllUserChat } = chatService;

router.post(
  '/create/',
  ValidJWT,
  createNewChat
);
router.get(
  '/getAll',
  [ValidJWT],
  getAllUserChat
);


module.exports = router;