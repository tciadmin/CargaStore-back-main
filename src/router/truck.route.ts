import { Router } from 'express';
import { TruckService } from '../services';
import { vehicleData } from '../config/vehicleData';
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
  const { brand } = req.query;  // Obtén la marca de la query

  // Asegúrate de que 'brand' sea una clave válida dentro de 'vehicleData.marcas'
  if (brand && vehicleData.marcas[brand as string]) {
    res.json(vehicleData.marcas[brand as string]);  // Devuelve los modelos correspondientes
  } else {
    res.status(400).json({ error: 'Marca no válida' });
  }
});

module.exports = router;
