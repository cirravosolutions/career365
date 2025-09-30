import { DrivePost, User, SubscriptionTier, DriveInterest, AnnouncementPost, AlumniPost } from '../types';

// The base URL for your PHP API. A relative path from the root is best.
const API_BASE_URL = '/api/index.php';

// --- HELPER FUNCTIONS ---

async function getRequest<T>(action: string, params: Record<string, string> = {}): Promise<T> {
    const query = new URLSearchParams({ action, ...params }).toString();
    const response = await fetch(`${API_BASE_URL}?${query}`, { credentials: 'include' });
    
    const text = await response.text();
    if (!response.ok) {
        try {
            const data = JSON.parse(text);
            throw new Error(data.error || 'A network error occurred.');
        } catch (e) {
             throw new Error(text || 'The server returned an unreadable error response.');
        }
    }
    if (!text) return null as T;
    
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("Received an invalid response from the server.");
    }
}

async function postRequest<T>(action: string, body: object): Promise<T> {
    const response = await fetch(`${API_BASE_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
    });
    
    const text = await response.text();
    if (!response.ok) {
        try {
            const data = JSON.parse(text);
            throw new Error(data.error || 'A server error occurred.');
        } catch(e) {
            throw new Error(text || 'The server returned an unreadable error response on POST.');
        }
    }
    if (!text) return null as T;

    try {
        return JSON.parse(text);
    } catch(e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("Received an invalid response from the server.");
    }
}

async function postFormDataRequest<T>(action: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_BASE_URL}?action=${action}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });

    const text = await response.text();
    if (!response.ok) {
        try {
            const data = JSON.parse(text);
            throw new Error(data.error || 'A server error occurred during file upload.');
        } catch (e) {
            throw new Error(text || 'The server returned an unreadable error during file upload.');
        }
    }
    if (!text) return null as T;

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("Received an invalid response from the server.");
    }
}


// --- AUTH ---
export const login = (username: string, password: string): Promise<User> => postRequest('login', { username, password });
export const logout = (): Promise<void> => getRequest('logout');
export const checkSession = (): Promise<User | null> => getRequest('checkSession');
export const register = (username: string, password: string): Promise<User> => postRequest('register', { username, password });

// --- DRIVES ---
export const fetchDrives = (visibility: 'all' | 'free' = 'all'): Promise<DrivePost[]> => getRequest('fetchDrives', { visibility });
export const createDrive = (driveData: Omit<DrivePost, 'id' | 'postedAt' | 'postedBy' | 'postedById'>): Promise<DrivePost> => postRequest('createDrive', { driveData });
export const updateDrive = (driveData: DrivePost): Promise<DrivePost> => postRequest('updateDrive', { driveData });
export const deleteDrive = (driveId: string): Promise<void> => postRequest('deleteDrive', { driveId });

// --- ANNOUNCEMENTS ---
export const fetchAnnouncements = (visibility: 'all' | 'public' | 'student' = 'all'): Promise<AnnouncementPost[]> => getRequest('fetchAnnouncements', { visibility });
export const createAnnouncement = (announcementData: Omit<AnnouncementPost, 'id' | 'postedAt' | 'postedBy' | 'postedById'>): Promise<AnnouncementPost> => postRequest('createAnnouncement', { announcementData });
export const updateAnnouncement = (announcementData: AnnouncementPost): Promise<AnnouncementPost> => postRequest('updateAnnouncement', { announcementData });
export const deleteAnnouncement = (announcementId: string): Promise<void> => postRequest('deleteAnnouncement', { announcementId });

// --- USERS (ADMIN ACTIONS) ---
export const fetchUsers = (): Promise<User[]> => getRequest('fetchUsers');
export const createUserByAdmin = (name: string, username: string, password: string, subscriptionTier: SubscriptionTier): Promise<User> => postRequest('createUserByAdmin', { name, username, password, subscriptionTier });
export const createAdmin = (name: string, username: string, password: string): Promise<User> => postRequest('createAdmin', { name, username, password });
export const deleteUser = (userIdToDelete: string): Promise<void> => postRequest('deleteUser', { userIdToDelete });

// --- INTERESTS ---
export const registerInterest = (driveId: string): Promise<DriveInterest> => postRequest('registerInterest', { driveId });
export const getUserInterests = (): Promise<DriveInterest[]> => getRequest('getUserInterests');
export const getInterestDetailsForDrive = (driveId: string): Promise<DriveInterest[]> => getRequest('getInterestDetailsForDrive', { driveId });
export const getDriveInterestCounts = (): Promise<{ [driveId: string]: number }> => getRequest('getDriveInterestCounts');

// --- ALUMNI ---
export const fetchAlumni = (): Promise<AlumniPost[]> => getRequest('fetchAlumni');
export const createAlumni = (formData: FormData): Promise<AlumniPost> => postFormDataRequest('createAlumni', formData);
export const updateAlumni = (formData: FormData): Promise<AlumniPost> => postFormDataRequest('updateAlumni', formData);
export const deleteAlumni = (alumniId: string): Promise<void> => postRequest('deleteAlumni', { alumniId });