import { Router } from 'express';
import { UserService } from '../services'; // Importa el servicio para obtener clientes y conductores
// import ValidJWT from '../middlewares/valid-jwt';
import { uploadImageProfile } from '../config/multerConfig';

const router = Router();

const { getAllCustomersAndDrivers, patchUser, pageInfo } =
  UserService;

router.get(
  '/all',
  //  ValidJWT,
  getAllCustomersAndDrivers
); // Ruta para obtener todos los clientes y conductores
router.patch(
  '/patchDataUser/:userId',
  //   ValidJWT,
  uploadImageProfile,
  patchUser
); // Ruta para obtener todos los clientes y conductores
router.get('/page_info', pageInfo);

module.exports = router;
