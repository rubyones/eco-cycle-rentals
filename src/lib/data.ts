import type { Renter, Bike, Station, Rental, NotificationSetting } from './types';

export const renters: Renter[] = [
  { id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'user-avatar-1', status: 'Active', rentalStatus: 'Renting', rentalHistoryCount: 12, joinDate: '2023-01-15' },
  { id: 'USR002', name: 'Bob Williams', email: 'bob@example.com', avatar: 'user-avatar-2', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 5, joinDate: '2023-03-22' },
  { id: 'USR003', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'user-avatar-3', status: 'Suspended', rentalStatus: 'Idle', rentalHistoryCount: 23, joinDate: '2022-11-30' },
  { id: 'USR004', name: 'Diana Miller', email: 'diana@example.com', avatar: 'user-avatar-4', status: 'Active', rentalStatus: 'Idle', rentalHistoryCount: 8, joinDate: '2023-05-10' },
];

export const bikes: Bike[] = [
  { id: 'EBK001', stationId: 'STN001', battery: 85, status: 'Available' },
  { id: 'EBK002', stationId: 'STN001', battery: 62, status: 'In-Use' },
  { id: 'EBK003', stationId: 'STN002', battery: 95, status: 'Available' },
  { id: 'EBK004', stationId: 'STN002', battery: 30, status: 'Locked' },
  { id: 'EBK005', stationId: 'STN003', battery: 75, status: 'Maintenance' },
  { id: 'EBK006', stationId: 'STN003', battery: 100, status: 'Available' },
  { id: 'EBK007', stationId: 'STN001', battery: 45, status: 'Available' },
];

export const stations: Station[] = [
  { id: 'STN001', name: 'Central Park', location: '40.782, -73.965', capacity: 10, bikes: 3 },
  { id: 'STN002', name: 'Downtown Plaza', location: '34.052, -118.243', capacity: 15, bikes: 2 },
  { id: 'STN003', name: 'Riverside Bike Hub', location: '41.878, -87.629', capacity: 12, bikes: 2 },
  { id: 'STN004', name: 'Ocean View Pier', location: '33.985, -118.471', capacity: 8, bikes: 0 },
];

export const rentals: Rental[] = [
  { id: 'RNT001', bikeId: 'EBK002', renterName: 'Alice Johnson', startTime: '2024-05-21T10:00:00Z', endTime: null, fee: 5.50, status: 'Active' },
  { id: 'RNT002', bikeId: 'EBK003', renterName: 'Bob Williams', startTime: '2024-05-20T14:30:00Z', endTime: '2024-05-20T15:30:00Z', fee: 4.00, status: 'Completed' },
  { id: 'RNT003', bikeId: 'EBK004', renterName: 'Diana Miller', startTime: '2024-05-19T08:00:00Z', endTime: '2024-05-19T12:00:00Z', fee: 12.00, status: 'Overdue' },
  { id: 'RNT004', bikeId: 'EBK001', renterName: 'Alice Johnson', startTime: '2024-05-21T11:00:00Z', endTime: '2024-05-21T11:30:00Z', fee: 2.50, status: 'Completed' },
];

export const notificationSettings: NotificationSetting[] = [
    { id: 'rental-reminders', label: 'Rental Time Reminders', description: 'Notify renters before their rental period ends.', active: true },
    { id: 'payment-due', label: 'Payment Due Notices', description: 'Send automated reminders for overdue payments.', active: true },
    { id: 'lock-warnings', label: 'Lock Warnings', description: 'Warn users before an e-bike is locked due to non-payment.', active: false },
]
