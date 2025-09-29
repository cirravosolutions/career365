import { DrivePost, User, UserRole, SubscriptionTier, PackageLevel } from '../types';

// --- CONFIGURATION ---
// This is your live API endpoint connected to your Google Sheet.
const API_URL = 'https://script.google.com/macros/s/AKfycbxBoSVLUmrZI3LjJnvZsvmio7l76Mk5jX1pyQRGgVatTsUfzacfDJi1RC0xOD7kxSk/exec'; 

// IMPORTANT: This key MUST match the secret key in your Google Apps Script.
const SECRET_KEY: string = 'My-Pl@cement-Drive-Hub-Key-2024!';

const mockAdminsWithPasswords = [
  { id: '101', username: 'sunflower', password: 'sunflower@123', role: UserRole.ADMIN },
  { id: '102', username: 'csjjpfp', password: 'yadavGIRI@4153', role: UserRole.SUPER_ADMIN },
];

// In-memory store for new users. In a real app, this would be a database.
const mockStudentsWithPasswords = [
    { id: '201', username: 'student', password: 'password', role: UserRole.STUDENT, subscriptionTier: SubscriptionTier.PREMIUM }
];
// --- END CONFIGURATION ---

// Helper function to handle POST requests to our Apps Script
async function postToActionApi(action: string, payload: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: 'cors', // Important for cross-origin requests
    redirect: 'follow', // Follow redirects, which Apps Script uses
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Apps Script limitation
    },
    body: JSON.stringify({
      secretKey: SECRET_KEY,
      action: action,
      payload: payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result;
}


export const fetchDrives = async (): Promise<DrivePost[]> => {
  console.log('API: Fetching drives from Google Sheet...');
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch drives from Google Sheet.');
  }
  const drives: DrivePost[] = await response.json();
  // Mock packageLevel for existing data if it's missing
  return drives.map((drive, index) => ({
      ...drive,
      // FIX: Use PackageLevel enum members instead of string literals to match DrivePost type.
      packageLevel: drive.packageLevel || (index % 3 === 0 ? PackageLevel.HIGH : index % 2 === 0 ? PackageLevel.MID : PackageLevel.LOW),
  }));
};

export const login = async (username: string, password: string): Promise<User> => {
  console.log(`API: Attempting login for user: ${username}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const adminRecord = mockAdminsWithPasswords.find(
    u => u.username === username && u.password === password
  );

  if (adminRecord) {
    console.log('API: Admin login successful');
    const { password: _, ...user } = adminRecord;
    return user;
  }
  
  const studentRecord = mockStudentsWithPasswords.find(
    u => u.username === username && u.password === password
  );

  if (studentRecord) {
    console.log('API: Student login successful');
    const { password: _, ...user } = studentRecord;
    return user;
  }

  console.error('API: Login failed - Invalid credentials');
  throw new Error('Invalid username or password');
};

export const logout = async (): Promise<void> => {
    console.log("API: Logging out");
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
}

// FIX: Add a register function to handle new user sign-ups.
export const register = async (username: string, password: string): Promise<User> => {
    console.log(`API: Attempting registration for user: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const existingUser = mockStudentsWithPasswords.find(u => u.username === username) || mockAdminsWithPasswords.find(u => u.username === username);
  
    if (existingUser) {
      console.error('API: Registration failed - Username already exists');
      throw new Error('Username already exists');
    }
  
    const newUser = {
      id: String(Date.now()), // Simple unique ID for mock user
      username,
      password,
      role: UserRole.STUDENT,
      subscriptionTier: SubscriptionTier.FREE,
    };
  
    mockStudentsWithPasswords.push(newUser);
    console.log('API: Registration successful for new student', newUser);
    const { password: _, ...userToReturn } = newUser;
    return userToReturn;
  };

export const createDrive = async (driveData: Omit<DrivePost, 'id' | 'postedAt' | 'postedBy' | 'postedById'>, user: User): Promise<DrivePost> => {
  console.log('API: Creating new drive in Google Sheet...');
  const payload = {
    ...driveData,
    postedBy: user.username,
    postedById: user.id,
  };
  
  const result = await postToActionApi('CREATE', payload);
  
  // We return a constructed object because the API only returns the new ID
  return {
    ...driveData,
    id: result.id,
    postedAt: new Date().toISOString(),
    postedBy: user.username,
    postedById: user.id,
  };
};

export const updateDrive = async (driveData: DrivePost, userId: string): Promise<DrivePost> => {
  console.log(`API: Updating drive ${driveData.id} in Google Sheet...`);
  const payload = {
      ...driveData,
      userId: userId, // Pass userId for authorization check in script
  };
  await postToActionApi('UPDATE', payload);
  return driveData; // Return the updated data on success
}

export const deleteDrive = async (driveId: string, userId: string): Promise<void> => {
  console.log(`API: Deleting drive ${driveId} from Google Sheet...`);
  const payload = {
    driveId,
    userId, // Pass userId for authorization check in script
  };
  await postToActionApi('DELETE', payload);
}
