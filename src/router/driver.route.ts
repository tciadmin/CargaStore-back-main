import { Router } from 'express';
import { DriverService } from '../services';
// import ValidJWT from '../middlewares/valid-jwt';
import {
  imagesLegalDocuments,
  pdfLegalDocuments,
  uploadImageProfile,
} from '../config/multerConfig';

const router = Router();
//Servicios
const {
  createDriver,
  getDriverByUserId,
  patchDriver,
  findDriver,
  patchDriverLegalDocuments,
  patchPdfLegalDocumentsDriver,
  patchImagesLegalDocuments,
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
  patchDriverLegalDocuments
);

router.patch(
  '/patch/pdf_legal_documents/:driverId',
  findDriver,
  pdfLegalDocuments,
  patchPdfLegalDocumentsDriver
);

router.patch(
  '/patch/image_legal_documents/:driverId',
  findDriver,
  imagesLegalDocuments,
  patchImagesLegalDocuments
);

router.patch('/change_validate_status/:driverId', validateDriver);

router.get('/list', getAllDrivers);

module.exports = router;
