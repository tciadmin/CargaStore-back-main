import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
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
  filename: (_req, file, cb) => cb(null, generatorNameFile(file)),
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

export const uploadTruckImages = multer({
  storage: imageStorage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos .jpeg, .jpg y .png'));
    }
  }
}).fields([
  { name: 'truckImage', maxCount: 1 },
  { name: 'plateImage', maxCount: 1 }
]);

export const uploadInvoice = invoice.single('invoice');

export const uploadImageProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  image.single('profile_image')(req, res, (err) => {
    if (err) {
      console.log('Error al subir foto de perfil');
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Error al subir foto de perfil',
        },
      });
    }
    if (!req.file) {
      return next(); // Continue to the next middleware if no file
    }
    if (!isMulterSingleFile(req.file)) {
      console.log('error al subir los archivos: ', req.file);
      return res.status(400).json({
        message: {
          type: 'error',
          msg: 'Error al subir foto de perfil',
        },
      });
    }
    next();
  });
};

export const uploadImages = image.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'truckImage', maxCount: 1 },
  { name: 'plateImage', maxCount: 1 },
]);

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
  destination?: string; // destination and filename might not be present in memory storage
  filename?: string;
  path?: string;
  buffer?: Buffer;
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
    (typeof file.destination === 'undefined' ||
      typeof file.destination === 'string') &&
    (typeof file.filename === 'undefined' ||
      typeof file.filename === 'string') &&
    (typeof file.path === 'undefined' ||
      typeof file.path === 'string')
  );
};

export const uploadLegalDocumentsFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const storagePath = file.mimetype.startsWith('image/')
        ? IMAGE_UPLOADS
        : INVOICE_UPLOADS;
      cb(null, storagePath);
    },
    filename: (req, file, cb) => cb(null, generatorNameFile(file)),
  }),
}).fields([
  { name: 'img_driver_license', maxCount: 1 },
  { name: 'img_insurance_policy', maxCount: 1 },
  { name: 'pdf_iess', maxCount: 1 },
  { name: 'pdf_port_permit', maxCount: 1 },
]);

export { isMulterRequestFiles, isMulterSingleFile };
