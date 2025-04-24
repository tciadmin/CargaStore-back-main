import { Router } from 'express';
import { TruckService } from '../services';
import { vehicleData } from '../config/vehicleDataConfig';
import { uploadTruckImages } from '../config/multerConfig';
// import ValidJWT from "../middlewares/valid-jwt";

const router = Router();
//Servicios
const { patchTruck, getAllTrucks } = TruckService;

router.patch(
  '/update/:userId',
  //  ValidJWT,
  patchTruck
);
router.get(
  '/all',
  // ValidJWT,
  getAllTrucks
);
// Rutas para marcas de vehículos
router.get('/vehicle/brands', (req, res) => {
  const brands = Object.keys(vehicleData.marcas);  // Las claves son las marcas
  res.json(brands);  // Devuelve las marcas de vehículos
});

// Rutas para modelos de vehículos
router.get('/vehicle/models', (req, res) => {
  const brand = String(req.query.brand || '').trim();  // Para eliminar espacios innecesarios
  
  if (!brand || !vehicleData.marcas[brand]) {
    return res.status(400).json({ error: 'Marca no válida' });
  }

  return res.json(vehicleData.marcas[brand]);
});

router.post(
  '/create',
  uploadTruckImages, // Middleware de multer que sube image1 y image2
  async (req, res) => {
    try {
      const { body, files } = req;

      const truckImage = (files?.truckImage as Express.Multer.File[] | undefined)?.[0]?.filename || null;
      const plateImage = (files?.plateImage as Express.Multer.File[] | undefined)?.[0]?.filename || null;

      if (!truckImage || !plateImage) {
        return res.status(400).json({ error: 'Faltan imágenes requeridas (camión o placa)' });
      }

      const result = await TruckService.createTruck({
        ...body,
        truckImage,
        plateImage,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear camión:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

export default router;
