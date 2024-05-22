export interface PackageInterface {
  id?: string;
  product_name: string;
  quantity: number;
  type: 'Seca' | 'Peligrosa' | 'Refrigerada';
  weight: number;
  volume: number;
  offered_price: number;
  product_pic: string;
  orderId?: string;
}
