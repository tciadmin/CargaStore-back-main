import { Router } from 'express';
import { PackageService } from '../services';
import { uploadImages } from '../config/multerConfig';

const router = Router();

const { editPackageImage } = PackageService;

router.patch(
  '/edit_image/:packageId',
  uploadImages,
  editPackageImage
);

module.exports = router;
