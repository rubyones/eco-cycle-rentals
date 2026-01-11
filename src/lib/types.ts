export type Renter = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'Active' | 'Suspended';
  rentalStatus: 'Idle' | 'Renting';
  rentalHistoryCount: number;
  joinDate: string;
};

export type Bike = {
  id: string;
  stationId: string;
  battery: number;
  status: 'Available' | 'Locked' | 'In-Use' | 'Maintenance';
};

export type Station = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  bikes: number;
};

export type Rental = {
  id:string;
  bikeId: string;
  renterName: string;
  startTime: string;
  endTime: string | null;
  fee: number;
  status: 'Active' | 'Completed' | 'Overdue';
};

export type NotificationSetting = {
  id: 'rental-reminders' | 'payment-due' | 'lock-warnings';
  label: string;
  description: string;
  active: boolean;
};
