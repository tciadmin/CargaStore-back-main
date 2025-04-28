export interface DriverInterface {
  id?: string;
  picture?: string;
  num_license?: number;
  rating?: number;
  description?: string;
  port_permit?: boolean;
  pdf_port_permit?: string;
  insurance_policy?: string;
  img_insurance_policy?: string;
  img_driver_license?: string;
  phone?: string;
  identification?: number;
  order_count?: number;
  iess?: boolean;
  pdf_iess?: string;
  validate_by_admin?: boolean;
  port?: boolean;
  policy?: number;
  userId?: number;
}
