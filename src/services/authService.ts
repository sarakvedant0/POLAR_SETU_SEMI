import { SavedItemRecord } from '../types';

export type UserRole =
  | 'Student'
  | 'Teacher'
  | 'Professor'
  | 'Polar Researcher / Scientist'
  | 'Climate Data Analyst'
  | 'Citizen Science Explorer';

export type UserPurpose =
  | 'Academic Research & Thesis'
  | 'Classroom Teaching & Education'
  | 'General Polar Science Interest'
  | 'Field Expedition Collaboration'
  | 'Climate Modeling & Policy Analysis';

export interface UserAccount {
  id: string;
  username: string; // Unique special key (e.g. @polar_kestrel_99)
  name: string;
  displayName?: string;
  email: string;
  password?: string;
  role: UserRole;
  purpose: UserPurpose;
  interests: string[];
  avatar?: string;
  avatarUrl?: string;
  institution?: string;
  followersCount: number;
  followingUsernames: string[];
  savedItems: SavedItemRecord[];
  securityStrikes: number;
  onboardingCompleted: boolean;
  joinedDate: string;
  bio?: string;
  xp?: number;
}

const STORAGE_KEY_USERS = 'polarsetu_registered_users_v2';
const STORAGE_KEY_CURRENT_USER = 'polarsetu_current_active_user_v2';

export type AuthListener = (user?: UserAccount) => void;
const authListeners = new Set<AuthListener>();

function notifyAuth(user?: UserAccount) {
  authListeners.forEach((l) => {
    try {
      l(user);
    } catch {}
  });
}

// Baseline default mock user so the app is instantly usable, but real sign-up/sign-in overrides it
const DEFAULT_GUEST_USER: UserAccount = {
  id: 'usr-default-1',
  username: '@polar_explorer_26',
  name: 'Polar Scholar',
  displayName: 'Dr. Ananya Sharma',
  email: 'explorer@ncpor.polar.res.in',
  role: 'Polar Researcher / Scientist',
  purpose: 'Academic Research & Thesis',
  interests: ['Climate Science', 'Glaciology', 'Antarctica Expeditions', 'Marine Biology'],
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  institution: 'NCPOR Polar Science Division, Goa',
  followersCount: 14,
  followingUsernames: ['@dr_rajeshwari_nair', '@prof_vikram_nio'],
  savedItems: [],
  securityStrikes: 0,
  onboardingCompleted: true,
  joinedDate: 'Jan 2026',
  bio: 'Cryosphere Research Fellow • Specializing in Antarctic ice shelf grounding line dynamics and remote sensing altimetry.',
  xp: 340,
};

class AuthService {
  private getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    const initial = [DEFAULT_GUEST_USER];
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
    } catch {}
    return initial;
  }

  private saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {}
  }

  getCurrentUser(): UserAccount {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return DEFAULT_GUEST_USER;
  }

  setCurrentUser(user: UserAccount): void {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    } catch {}
    notifyAuth(user);
  }

  /**
   * Generates a unique special username key if the user wants an auto-suggested one
   */
  generateSpecialKey(prefix: string = 'polar_scholar'): string {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    return `@${prefix.toLowerCase().replace(/[^a-z0-9_]/g, '')}_${randomDigits}`;
  }

  signup(data: {
    username: string;
    name: string;
    email: string;
    password?: string;
  }): { success: boolean; user?: UserAccount; error?: string } {
    let username = data.username.trim();
    if (!username.startsWith('@')) {
      username = '@' + username;
    }

    if (username.length < 4) {
      return { success: false, error: 'Special username key must be at least 4 characters.' };
    }

    const users = this.getUsers();
    const existing = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || (data.email && u.email.toLowerCase() === data.email.toLowerCase())
    );

    if (existing) {
      return { success: false, error: 'Special username key or email is already taken. Please choose another unique key.' };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now().toString(36)}`,
      username,
      name: data.name.trim() || username.replace('@', ''),
      displayName: data.name.trim() || username.replace('@', ''),
      email: data.email.trim(),
      password: data.password || 'polar2026',
      role: 'Student', // Default before questionnaire
      purpose: 'General Polar Science Interest',
      interests: ['Climate Science', 'Glaciology', 'Antarctica Expeditions'],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      followersCount: 0,
      followingUsernames: [],
      savedItems: [],
      securityStrikes: 0,
      onboardingCompleted: false, // Triggers First-Time Onboarding Questionnaire
      joinedDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      xp: 100,
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  login(usernameOrKey: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
    let query = usernameOrKey.trim();
    if (!query.startsWith('@') && !query.includes('@')) {
      query = '@' + query;
    }

    const users = this.getUsers();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === query.toLowerCase() ||
        u.email.toLowerCase() === query.toLowerCase() ||
        u.username.toLowerCase().replace('@', '') === query.toLowerCase().replace('@', '')
    );

    if (!user) {
      return { success: false, error: 'No account found with this special username key. Please check or sign up.' };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password for this account.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  logout(): void {
    this.setCurrentUser(DEFAULT_GUEST_USER);
  }

  completeOnboarding(role: UserRole, purpose: UserPurpose, interests: string[]): UserAccount {
    const current = this.getCurrentUser();
    const updated: UserAccount = {
      ...current,
      role,
      purpose,
      interests: interests.length > 0 ? interests : ['Climate Science'],
      onboardingCompleted: true,
    };

    this.updateUserRecord(updated);
    return updated;
  }

  updateUserRecord(user: UserAccount): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
    this.setCurrentUser(user);
  }

  updateInterests(interests: string[]): void {
    const current = this.getCurrentUser();
    this.updateUserRecord({ ...current, interests });
  }

  addInterest(interest: string): void {
    const current = this.getCurrentUser();
    if (!current.interests.includes(interest)) {
      const updatedInterests = [...current.interests, interest];
      this.updateUserRecord({ ...current, interests: updatedInterests });
    }
  }

  toggleSaveItem(item: {
    id?: string;
    itemId?: string;
    type?: string;
    itemType?: 'research' | 'post' | 'media' | 'dataset' | 'expedition';
    title: string;
    subtitle?: string;
    imageUrl?: string;
    thumbnail?: string;
    author?: string;
    category?: string;
    date?: string;
    metadata?: Record<string, any>;
  }): boolean {
    const current = this.getCurrentUser();
    const saved = [...(current.savedItems || [])];
    const targetId = item.itemId || item.id || '';
    const resolvedType = (item.itemType || item.type || 'research') as 'research' | 'post' | 'media' | 'dataset' | 'expedition';

    const existingIdx = saved.findIndex((s) => s.itemId === targetId || s.id === targetId);

    let isNowSaved = false;
    if (existingIdx !== -1) {
      // Remove
      saved.splice(existingIdx, 1);
      isNowSaved = false;
    } else {
      // Add
      const newRecord: SavedItemRecord = {
        id: `saved-${Date.now().toString(36)}`,
        itemId: targetId,
        itemType: resolvedType,
        type: resolvedType,
        title: item.title,
        subtitle: item.subtitle || item.category || item.author,
        imageUrl: item.imageUrl || item.thumbnail,
        author: item.author,
        category: item.category,
        dateSaved: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        metadata: item.metadata,
      };
      saved.unshift(newRecord);
      isNowSaved = true;
    }

    this.updateUserRecord({ ...current, savedItems: saved });
    return isNowSaved;
  }

  isItemSaved(itemId: string): boolean {
    const current = this.getCurrentUser();
    return (current.savedItems || []).some((s) => s.itemId === itemId || s.id === itemId);
  }

  getSavedItems(): SavedItemRecord[] {
    return this.getCurrentUser().savedItems || [];
  }

  toggleFollow(username: string): boolean {
    const current = this.getCurrentUser();
    const following = [...(current.followingUsernames || [])];
    const clean = username.startsWith('@') ? username : '@' + username;
    const idx = following.indexOf(clean);

    let isNowFollowing = false;
    if (idx !== -1) {
      following.splice(idx, 1);
      isNowFollowing = false;
    } else {
      following.push(clean);
      isNowFollowing = true;
    }

    this.updateUserRecord({ ...current, followingUsernames: following });
    return isNowFollowing;
  }

  isFollowing(username: string): boolean {
    const current = this.getCurrentUser();
    const clean = username.startsWith('@') ? username : '@' + username;
    return (current.followingUsernames || []).includes(clean);
  }

  addSecurityStrike(reason: string): number {
    const current = this.getCurrentUser();
    const strikes = (current.securityStrikes || 0) + 1;
    this.updateUserRecord({ ...current, securityStrikes: strikes });
    return strikes;
  }

  getAllUsers(): UserAccount[] {
    return this.getUsers();
  }

  getAllRegisteredUsers(): UserAccount[] {
    return this.getUsers();
  }

  subscribe(listener: AuthListener): () => void {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  }
}

export const authService = new AuthService();
