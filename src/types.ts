export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum SubscriptionTier {
  FREE = 'FREE',
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
  id:string;
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

export interface AnnouncementPost {
  id: string;
  title: string;
  content: string;
  postedAt: string;
  postedBy: string;
  postedById: string;
  isPublic?: boolean;
}

export interface AlumniPost {
  id: string;
  name: string;
  companyName: string;
  placementDate: string; // YYYY-MM-DD
  package?: string; // e.g., "12 LPA"
  photoUrl: string; // A relative or absolute URL to the image
  postedAt: string;
  postedBy: string;
  postedById: string;
}
