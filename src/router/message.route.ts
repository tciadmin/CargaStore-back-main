import { Router } from 'express';
import ValidJWT from '../middlewares/valid-jwt';
import chatService from '../services/chat.service';
import messageService from '../services/message.service';

const router = Router();
//Servicios
const { getLastMessage, getAllMessages } = messageService;

router.get('/getLast', [ValidJWT], getLastMessage);
router.get(
  '/getAll/:chatID',
  // [ValidJWT],
  getAllMessages
);

module.exports = router;
