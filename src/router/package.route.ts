import { Router } from 'express';
import { PackageService } from '../services';
import { uploadImages } from '../config/multerConfig';
import ValidJWT from '../middlewares/valid-jwt';

const router = Router();

const { editPackageImage } = PackageService;

router.patch(
  '/edit_image/:packageId',
  ValidJWT,
  uploadImages,
  editPackageImage
);

module.exports = router;
