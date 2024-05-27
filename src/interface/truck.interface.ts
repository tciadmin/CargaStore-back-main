import { ChargeCapacity, ChargeType } from "../models/trucks.model";

export interface TruckInterface {
  id?: string;
  brand: string;
  model: string;
  year: number;
  charge_type: ChargeType;
  num_plate: string; // Agregado: num_plate de tipo string
  capacity: number; // Agregado: capacity de tipo number
  charge_capacity: ChargeCapacity;
}
