import { Status } from "@/core/shared";

export interface BranchResponse {
  id: string;
  name: string;
  address: string;
  status: Status;
}

export interface BranchRequest {
  name: string;
  address: string;
}

export interface ConsultingRoomResponse {
  id: string;
  branchId: string;
  branchName: string;
  roomNumber: string;
  status: Status;
}

export interface ConsultingRoomRequest {
  branchId: string;
  roomNumber: string;
}
