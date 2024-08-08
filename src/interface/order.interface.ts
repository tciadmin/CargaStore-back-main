export interface OrderInterface {
  id?: string;
  status?: 'pendiente' | 'asignado' | 'en Curso' | 'finalizado';
  orderType: 'nacional' | 'internacional';
  receiving_company: string;
  contact_number: number;
  receiving_company_RUC: number;
  pick_up_date: Date;
  pick_up_time: string;
  pick_up_address: string;
  delivery_date: Date;
  delivery_time: string;
  delivery_address: string;
  enPreparacion?: Date | null;
  preparado?: Date | null;
  retirado?: Date | null;
  enCamino?: Date | null;
  customerId?: string;
  packageId?: string;
  payId?: string;
  invoicePath?: string; // Agrega la ruta de la factura
}
