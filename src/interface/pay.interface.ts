export interface PayInterface {
  id?: string;
  total: number;
  status: "pendiente" | "acreditado";
  userId: number;
  driverId?: string;
  orderId?: string;
}
