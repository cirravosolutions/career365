
import { DrivePost, User, SubscriptionTier, DriveInterest } from '../types';

// The base path to your new multi-file PHP backend.
const API_BASE_URL = 'api/';

/**
 * A helper function to make requests to the PHP backend.
 * It automatically handles session cookies and error parsing.
 */
async function apiRequest<T>(
  action: string, 
  method: 'GET' | 'POST', 
  body?: any, 
  queryParams?: string
): Promise<T> {
    const url = `${API_BASE_URL}${action}${queryParams || ''}`;

    const options: RequestInit = {
        method,
        credentials: 'include', // Crucial for sending session cookies
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    if (method === 'POST' && body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `HTTP error! Status: ${response.status}` }));
            throw new Error(errorData.error || `An unknown error occurred.`);
        }
        
        const text = await response.text();
        return text ? JSON.parse(text) : null;

    } catch (error) {
        console.error(`API request failed for action "${action}":`, error);
        throw error;
    }
}

// --- AUTHENTICATION ---
export const login = (username: string, password: string): Promise<User> => 
    apiRequest<User>('login', 'POST', { username, password });

export const logout = (): Promise<void> => 
    apiRequest<void>('logout', 'POST');

export const checkSession = (): Promise<User | null> => 
    apiRequest<User | null>('session', 'GET');

export const register = (username: string, password: string): Promise<User> => 
    apiRequest<User>('register', 'POST', { username, password });

// --- DRIVES ---
export const fetchDrives = (visibility: 'all' | 'free' = 'all'): Promise<DrivePost[]> => 
    apiRequest<DrivePost[]>('drives', 'GET', undefined, `?visibility=${visibility}`);

export const createDrive = (driveData: Omit<DrivePost, 'id' | 'postedAt' | 'postedBy' | 'postedById'>, user: User): Promise<{ id: string }> => 
    apiRequest<{ id: string }>('drives', 'POST', driveData);

export const updateDrive = (driveData: DrivePost, userId: string): Promise<void> => 
    apiRequest<void>('update-drive', 'POST', driveData);

export const deleteDrive = (driveId: string, userId: string): Promise<void> => 
    apiRequest<void>('delete-drive', 'POST', { driveId });

// --- USER MANAGEMENT (For Admins) ---
export const fetchUsers = (adminId: string): Promise<User[]> => 
    apiRequest<User[]>('users', 'GET');

export const createUserByAdmin = (name: string, username: string, password: string, subscriptionTier: SubscriptionTier): Promise<User> => 
    apiRequest<User>('create-user-by-admin', 'POST', { name, username, password, subscriptionTier });

export const createAdmin = (name: string, username: string, password: string, superAdminId: string): Promise<User> => 
    apiRequest<User>('create-admin', 'POST', { name, username, password });

export const deleteUser = (userIdToDelete: string, adminId: string): Promise<void> => 
    apiRequest<void>('delete-user', 'POST', { userIdToDelete });

// --- STUDENT INTERESTS ---
export const registerInterest = (driveId: string, user: User): Promise<DriveInterest> => 
    apiRequest<DriveInterest>('register-interest', 'POST', { driveId });

export const getUserInterests = (userId: string): Promise<DriveInterest[]> => 
    apiRequest<DriveInterest[]>('user-interests', 'GET');

export const getInterestDetailsForDrive = (driveId: string, adminId: string): Promise<DriveInterest[]> => 
    apiRequest<DriveInterest[]>(`drive-attendees/${driveId}`, 'GET');
