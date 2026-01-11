import { Timestamp } from "firebase/firestore";

export type Renter = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateJoined: string | Timestamp;
  status: 'active' | 'suspended' | 'deactivated';
};

export type Ebike = {
  id: string;
  stationId: string;
  batteryLevel: number;
  status: 'Available' | 'Locked' | 'In-Use' | 'Maintenance';
  locked: boolean;
  lastMaintenanceDate?: string;
  image?: string;
};

export type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  parkingBays: number;
};

export type Rental = {
  id:string;
  ebikeId: string;
  renterId: string;
  startTime: string | Timestamp;
  endTime: string | Timestamp | null;
  rentalFee: number;
  status: 'active' | 'completed' | 'overdue' | 'paid';
  stationId: string;
};

export type Payment = {
    id: string;
    renterId: string;
    rentalId: string;
    paymentDate: string | Timestamp;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
};

export type MaintenanceIssue = {
    id: string;
    ebikeId: string;
    reportDate: string | Timestamp;
    description: string;
    status: 'open' | 'in progress' | 'resolved';
    resolutionDate?: string | Timestamp | null;
}

export type NotificationSetting = {
  id: 'rental-reminders' | 'payment-due' | 'lock-warnings';
  label: string;
  description: string;
  active: boolean;
};

    