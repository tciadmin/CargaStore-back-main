export interface PackageInterface {
  id?: string;
  product_name: string;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  quantity: number;
  type: 'seca' | 'peligrosa' | 'refrigerada';
  weight: string;
  volume: string;
  offered_price: string;
  orderId?: string;
}
