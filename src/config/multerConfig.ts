import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const FOLDER_UPLOADS = 'uploads/';

const generatorNameFile = (file: Express.Multer.File) =>
  `${uuidv4()}${path.extname(file.originalname)}`;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FOLDER_UPLOADS),
  filename: (_req, file, cb) => cb(null, generatorNameFile(file)),
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  },
});

export const uploadInvoice = upload.single('invoice');
