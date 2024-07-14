import { Router } from 'express';
import ValidJWT from '../middlewares/valid-jwt';
import chatService from '../services/chat.service';
import messageService from '../services/message.service';

const router = Router();
//Servicios
const { createNewMessage, getLastMessage, getAllMessages } = messageService;

router.post(
  '/create/',
  ValidJWT,
  createNewMessage
);
router.get(
    '/getLast',
    ValidJWT,
    getLastMessage
)
router.get(
    '/getAll',
    ValidJWT,
    getAllMessages
)

module.exports = router;