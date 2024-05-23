export interface DriverInterface {
  id?: string;
  picture: string;
  num_license: number;
  exp_license: Date;
  iess?: boolean;
  description: string;
  userId?: number;
}
