import { ChargeType, VehicleType  } from '../models/trucks.model';

export interface TruckInterface {
  id?: string;
  brand: string;
  model: string;
  vehicle_type: VehicleType;  
  year: number;
  charge_type: ChargeType;
  num_plate?: string; // Agregado: num_plate de tipo string
  charge_capacity: string;
  hasGps: boolean;
  truckImage?: string;
  plateImage?: string;
  driverId?: string;
}
