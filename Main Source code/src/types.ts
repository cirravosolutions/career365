export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Updated Subscription Tiers to a simple freemium model
export enum SubscriptionTier {
  FREE = 'FREE',
  // PREMIUM priced at ₹49
  PREMIUM = 'PREMIUM',
}

export enum PackageLevel {
  LOW = 'LOW',
  MID = 'MID',
  HIGH = 'HIGH',
}

export interface User {
  id: string;
  username: string;
  name: string;
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
  postedById: string; 
  applyLink?: string; 
  packageLevel: PackageLevel;
  isFree?: boolean;
}

export interface DriveInterest {
  passId: string;
  userId: string;
  driveId: string;
  userName: string;
  studentId: string;
}