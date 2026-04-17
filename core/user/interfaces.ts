import { Role, Status } from "@/core/shared";

export interface User {
  id: number;
  authId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phone: string;
  email: string;
  role: Role;
  balance: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
