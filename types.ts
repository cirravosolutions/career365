export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC', // 99
  STANDARD = 'STANDARD', // 249
  PREMIUM = 'PREMIUM', // 500
}

export enum PackageLevel {
  LOW = 'LOW',
  MID = 'MID',
  HIGH = 'HIGH',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  subscriptionTier?: SubscriptionTier;
}

export interface DrivePost {
  id: string;
  companyName: string;
  role: string;
  description: string;
  eligibility: string[];
  location: string;
  salary?: string;
  applyDeadline: string;
  postedAt: string;
  postedBy: string;
  postedById: string; // New field to link post to a user
  applyLink?: string; // Link to the application page
  packageLevel: PackageLevel; // New field
}
