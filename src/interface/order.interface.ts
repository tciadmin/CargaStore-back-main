export interface OrderInterface {
  id?: string;
  status?: "pendiente" | "asignado" | "en Curso" | "finalizado";
  orderType: "national" | "international";
  receiving_company: string;
  contact_number: number;
  receiving_company_RUC: number;
  pick_up_date: Date;
  pick_up_time: string;
  pick_up_address: string;
  pick_up_city: string;
  delivery_date: Date;
  delivery_time: string;
  delivery_address: string;
  delivery_city: string;
  customerId?: string;
  packageId?: string;
  payId?: string;
  invoicePath?: string; // Agrega la ruta de la factura
}
