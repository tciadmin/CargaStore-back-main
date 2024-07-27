import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const INVOICE_UPLOADS = 'uploads/invoice/';

const IMAGE_UPLOADS = 'uploads/images/';

const generatorNameFile = (file: Express.Multer.File) =>
  `${uuidv4()}${path.extname(file.originalname)}`;

const invoiceStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, INVOICE_UPLOADS),
  filename: (_req, file, cb) => cb(null, generatorNameFile(file)),
});

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGE_UPLOADS),
  filename: (_req, file: Express.Multer.File, cb) =>
    cb(null, generatorNameFile(file)),
});

const invoice = multer({
  storage: invoiceStorage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  },
});

const image = multer({
  storage: imageStorage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    // Verifica que el archivo sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

export const uploadInvoice = invoice.single('invoice');

export const uploadImages = image.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]);

export const uploadImageProfile = image.single('profile_image');

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

interface MulterRequestFiles {
  [fieldname: string]: MulterFile[];
}

const isMulterRequestFiles = (
  files: any
): files is MulterRequestFiles => {
  return (
    files &&
    typeof files === 'object' &&
    Object.keys(files).every((key) => Array.isArray(files[key]))
  );
};

interface MulterSingleFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

const isMulterSingleFile = (file: any): file is MulterSingleFile => {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.fieldname === 'string' &&
    typeof file.originalname === 'string' &&
    typeof file.encoding === 'string' &&
    typeof file.mimetype === 'string' &&
    typeof file.size === 'number' &&
    typeof file.destination === 'string' &&
    typeof file.filename === 'string' &&
    typeof file.path === 'string'
  );
};

export { isMulterRequestFiles, isMulterSingleFile };
