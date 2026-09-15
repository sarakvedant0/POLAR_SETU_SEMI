import { SavedItemRecord } from '../types';
import { supabase } from '../lib/supabase';

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

export type AuthListener = (user: UserAccount | null) => void;
const authListeners = new Set<AuthListener>();

function notifyAuth(user: UserAccount | null) {
  authListeners.forEach((l) => {
    try {
      l(user);
    } catch {}
  });
}

class AuthService {
  private getUsers(): UserAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out legacy default mock user so user database is clean
          return parsed.filter((u: UserAccount) => u.id !== 'usr-default-1' && u.username !== '@polar_explorer_26');
        }
      }
    } catch {}
    return [];
  }

  private saveUsers(users: UserAccount[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {}
    void this.persistUsersToSupabase(users);
  }

  private async persistUsersToSupabase(users: UserAccount[]): Promise<void> {
    const rows = users.map(({ password, ...user }) => ({
      id: `user:${user.id}`,
      user_key: user.id,
      interaction_type: 'user_preferences',
      target_id: user.id,
      payload: user,
    }));

    const { error } = await supabase
      .from('interactions')
      .upsert(rows, { onConflict: 'id' });

    if (error) console.error('Failed to persist user interactions:', error);
  }

  getCurrentUser(): UserAccount | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Clear out previous pre-signed default mock user so the app enters Guest Mode
        if (parsed && (parsed.id === 'usr-default-1' || parsed.username === '@polar_explorer_26')) {
          localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
          return null;
        }
        if (parsed && parsed.id && parsed.username) {
          return parsed;
        }
      }
    } catch {}
    return null; // Guest mode by default
  }

  isGuest(): boolean {
    return this.getCurrentUser() === null;
  }

  setCurrentUser(user: UserAccount | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
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
    this.setCurrentUser(null);
  }

  completeOnboarding(role: UserRole, purpose: UserPurpose, interests: string[]): UserAccount | null {
    const current = this.getCurrentUser();
    if (!current) return null;
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
    if (current) {
      this.updateUserRecord({ ...current, interests });
    }
  }

  addInterest(interest: string): void {
    const current = this.getCurrentUser();
    if (current && !current.interests.includes(interest)) {
      const updatedInterests = [...current.interests, interest];
      this.updateUserRecord({ ...current, interests: updatedInterests });
    }
  }

  private getGuestSavedItems(): SavedItemRecord[] {
    try {
      const stored = localStorage.getItem('polarsetu_guest_saved_items_v2');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return [];
  }

  private saveGuestSavedItems(items: SavedItemRecord[]): void {
    try {
      localStorage.setItem('polarsetu_guest_saved_items_v2', JSON.stringify(items));
    } catch {}
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
    const saved = current ? [...(current.savedItems || [])] : this.getGuestSavedItems();
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

    if (current) {
      this.updateUserRecord({ ...current, savedItems: saved });
    } else {
      this.saveGuestSavedItems(saved);
    }
    return isNowSaved;
  }

  isItemSaved(itemId: string): boolean {
    const current = this.getCurrentUser();
    const saved = current ? (current.savedItems || []) : this.getGuestSavedItems();
    return saved.some((s) => s.itemId === itemId || s.id === itemId);
  }

  getSavedItems(): SavedItemRecord[] {
    const current = this.getCurrentUser();
    return current ? (current.savedItems || []) : this.getGuestSavedItems();
  }

  toggleFollow(username: string): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
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
    if (!current) return false;
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
