import { Router } from 'express';
import { DriverService } from '../services';
// import ValidJWT from '../middlewares/valid-jwt';
import {
  uploadImageProfile,
  uploadLegalDocumentsFile,
} from '../config/multerConfig';

const router = Router();
//Servicios
const {
  createDriver,
  getDriverByUserId,
  patchDriver,
  patchDriverLegalDocuments,
  getAllDrivers,
  validateDriver,
} = DriverService;

router.post(
  '/create/:userId',
  //  ValidJWT,
  createDriver
);
router.get(
  '/get/:userId',
  // ValidJWT,
  getDriverByUserId
);
router.patch(
  '/patch/:userId',
  // ValidJWT,
  uploadImageProfile,
  patchDriver
);

router.patch(
  '/patch/legal_documents/:driverId',
  uploadLegalDocumentsFile,
  patchDriverLegalDocuments
);

router.patch('/change_validate_status/:driverId', validateDriver);

router.get('/list', getAllDrivers);

module.exports = router;
