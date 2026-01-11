import type { Renter, Bike, Station, Rental, NotificationSetting } from './types';

export const renters: Renter[] = [
  { id: 'USR001', name: 'John Paul Mendoza', email: 'jp@example.com', avatar: 'user-avatar-1', status: 'Active', rentalStatus: 'Renting', rentalHistoryCount: 12, joinDate: '2023-01-15' },
  { id: 'USR002', name: 'Anne Christine Lopez', email: 'anne@example.com', avatar: 'user-avatar-2', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 5, joinDate: '2023-03-22' },
  { id: 'USR003', name: 'Carlo Miguel Garcia', email: 'carlo@example.com', avatar: 'user-avatar-3', status: 'Suspended', rentalStatus: 'Idle', rentalHistoryCount: 23, joinDate: '2022-11-30' },
  { id: 'USR004', name: 'Daniel Cruz', email: 'daniel@example.com', avatar: 'user-avatar-4', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 8, joinDate: '2023-05-10' },
  { id: 'USR005', name: 'Sophia Mae Flores', email: 'sophia@example.com', avatar: 'user-avatar-2', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 2, joinDate: '2023-08-18' },
  { id: 'USR006', name: 'Kevin James Navarro', email: 'kevin@example.com', avatar: 'user-avatar-1', status: 'Active', rentalStatus: 'Renting', rentalHistoryCount: 9, joinDate: '2023-09-01' },
  { id: 'USR007', name: 'Angelica Torres', email: 'angelica@example.com', avatar: 'user-avatar-2', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 15, joinDate: '2022-12-25' },
];

export let bikes: Bike[] = [
  { id: 'EBK001', stationId: 'STN001', battery: 85, status: 'Available', image: 'ebike-1' },
  { id: 'EBK002', stationId: 'STN001', battery: 62, status: 'In-Use', image: 'ebike-2' },
  { id: 'EBK003', stationId: 'STN002', battery: 95, status: 'Available', image: 'ebike-3' },
  { id: 'EBK004', stationId: 'STN002', battery: 30, status: 'Locked', image: 'ebike-1' },
  { id: 'EBK005', stationId: 'STN003', battery: 75, status: 'Maintenance', image: 'ebike-2' },
  { id: 'EBK006', stationId: 'STN003', battery: 100, status: 'Available', image: 'ebike-3' },
  { id: 'EBK007', stationId: 'STN001', battery: 45, status: 'Available', image: 'ebike-1' },
];

export const stations: Station[] = [
  { id: 'STN001', name: 'Central Park', location: '40.782, -73.965', capacity: 10, bikes: 3 },
  { id: 'STN002', name: 'Downtown Plaza', location: '34.052, -118.243', capacity: 15, bikes: 2 },
  { id: 'STN003', name: 'Riverside Bike Hub', location: '41.878, -87.629', capacity: 12, bikes: 2 },
  { id: 'STN004', name: 'Ocean View Pier', location: '33.985, -118.471', capacity: 8, bikes: 0 },
];

export const rentals: Rental[] = [
  { id: 'RNT001', bikeId: 'EBK002', renterName: 'John Paul Mendoza', startTime: '2024-05-21T10:00:00Z', endTime: null, fee: 275.00, status: 'Active' },
  { id: 'RNT002', bikeId: 'EBK003', renterName: 'Anne Christine Lopez', startTime: '2024-05-20T14:30:00Z', endTime: '2024-05-20T15:30:00Z', fee: 200.00, status: 'Completed' },
  { id: 'RNT003', bikeId: 'EBK004', renterName: 'Daniel Cruz', startTime: '2024-05-19T08:00:00Z', endTime: '2024-05-19T12:00:00Z', fee: 600.00, status: 'Overdue' },
  { id: 'RNT004', bikeId: 'EBK001', renterName: 'John Paul Mendoza', startTime: '2024-05-21T11:00:00Z', endTime: '2024-05-21T11:30:00Z', fee: 125.00, status: 'Completed' },
  { id: 'RNT005', bikeId: 'EBK006', renterName: 'Kevin James Navarro', startTime: '2024-05-22T09:00:00Z', endTime: null, fee: 150.00, status: 'Active' },
];

export const notificationSettings: NotificationSetting[] = [
    { id: 'rental-reminders', label: 'Rental Time Reminders', description: 'Notify renters before their rental period ends.', active: true },
    { id: 'payment-due', label: 'Payment Due Notices', description: 'Send automated reminders for overdue payments.', active: true },
    { id: 'lock-warnings', label: 'Lock Warnings', description: 'Warn users before an e-bike is locked due to non-payment.', active: false },
]
