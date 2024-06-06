export interface PayInterface {
  id?: string;
  total: number;
  status: "pendiente" | "acreditado";
  customerId: string;
  driverId: string;
  orderId?: number;
}
