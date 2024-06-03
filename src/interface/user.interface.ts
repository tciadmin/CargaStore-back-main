import { RoleType } from "../models/users.model";
export interface UserModelI {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  role?: RoleType;
  email_verified: boolean;
  status: boolean;
  createdAt: string;
}
