export interface TruckInterface {
  id?: string;
  brand: string;
  model: string;
  year: number;
  charge_type: 'seca' | 'peligrosa' | 'refrigerada';
}
