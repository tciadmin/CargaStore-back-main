import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const FOLDER_UPLOADS = "uploads/";

const generatorNameFile = (file: Express.Multer.File) =>
  `${uuidv4()}${path.extname(file.originalname)}`;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FOLDER_UPLOADS),
  filename: (_req, file, cb) => cb(null, generatorNameFile(file)),
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const fileTypes = /pdf/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("El archivo debe ser un PDF válido"));
  },
});

export const uploadInvoice = upload.single("invoice");
