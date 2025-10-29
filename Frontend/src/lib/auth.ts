// src/lib/auth.ts
import { authService } from './supabase-services'

export type User = {
  id: string;
  name: string;
  email: string;
  location?: string;
  avatarUrl?: string;
};

// Storage keys for local cache
const AUTH_FLAG_KEY = "rc_auth";
const CURRENT_USER_KEY = "rc_user";

// Get current user from Supabase or cache
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Try to get from Supabase first
    const { user, error } = await authService.getCurrentUser();
    
    if (error || !user) {
      // Clear cache if Supabase says no user
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(AUTH_FLAG_KEY);
      return null;
    }

    // Get profile data
    const userProfile: User = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      location: user.user_metadata?.location,
      avatarUrl: user.user_metadata?.avatar_url,
    };

    // Cache it
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
    localStorage.setItem(AUTH_FLAG_KEY, "1");

    return userProfile;
  } catch {
    return null;
  }
}

// Get user from cache (synchronous)
export function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function notifyAuthChange() {
  window.dispatchEvent(new StorageEvent("storage", { key: AUTH_FLAG_KEY }));
}

export function isAuthed(): boolean {
  return localStorage.getItem(AUTH_FLAG_KEY) === "1";
}

// Register new user with Supabase
export async function registerUser(input: { 
  name: string; 
  email: string; 
  password: string; 
  location?: string 
}): Promise<{ ok: true; user: User; needsEmailConfirmation?: boolean } | { ok: false; error: string }> {
  try {
    const { data, error } = await authService.signUp(
      input.email.trim().toLowerCase(),
      input.password,
      input.name.trim()
    );

    if (error) {
      return { ok: false, error: error.message || 'Signup failed' };
    }

    if (!data.user) {
      return { ok: false, error: 'Signup failed - no user returned' };
    }

    // Check if email confirmation is required
    const needsEmailConfirmation = !data.session;

    const userProfile: User = {
      id: data.user.id,
      email: data.user.email || input.email,
      name: input.name.trim(),
      location: input.location?.trim(),
    };

    // Only cache the user if they have a session (email confirmed or confirmation disabled)
    if (data.session) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
      localStorage.setItem(AUTH_FLAG_KEY, "1");
      notifyAuthChange();
    }

    return { ok: true, user: userProfile, needsEmailConfirmation };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return { ok: false, error: message };
  }
}

// Login user with Supabase
export async function loginUser(
  email: string, 
  password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const { data, error } = await authService.signIn(
      email.trim().toLowerCase(),
      password
    );

    if (error) {
      return { ok: false, error: error.message || 'Invalid email or password' };
    }

    if (!data.user) {
      return { ok: false, error: 'Login failed - no user returned' };
    }

    const userProfile: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      location: data.user.user_metadata?.location,
      avatarUrl: data.user.user_metadata?.avatar_url,
    };

    // Cache the user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userProfile));
    localStorage.setItem(AUTH_FLAG_KEY, "1");
    notifyAuthChange();

    return { ok: true, user: userProfile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An error occurred';
    return { ok: false, error: message };
  }
}

// Logout user
export async function logoutUser(): Promise<void> {
  try {
    await authService.signOut();
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    // Always clear local cache
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    notifyAuthChange();
  }
}

// Update current user profile
export async function updateCurrentUser(patch: { 
  name?: string; 
  location?: string; 
  avatarUrl?: string 
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const cachedUser = getCachedUser();
  if (!cachedUser) return { ok: false, error: 'Not logged in' };

  try {
    // Update the cached user
    const updated = { ...cachedUser, ...patch };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    notifyAuthChange();

    // Note: You may want to update user_metadata in Supabase here
    // This would require updating the profile in the profiles table
    
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed';
    return { ok: false, error: message };
  }
}

// Change password
// Note: Currently not implemented - use Supabase password reset instead
export async function changePassword(
  oldPw: string, 
  newPw: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const cachedUser = getCachedUser();
    if (!cachedUser) return { ok: false, error: 'Not logged in' };

    // Verify old password by trying to sign in
    const { error: verifyError } = await authService.signIn(cachedUser.email, oldPw);
    if (verifyError) {
      return { ok: false, error: 'Current password is incorrect' };
    }

    // TODO: Implement password update using Supabase Auth
    // await supabase.auth.updateUser({ password: newPw })
    console.log('Password change requested for:', cachedUser.email, 'New password length:', newPw.length);
    
    return { ok: false, error: 'Password change not yet implemented. Please use Supabase password reset.' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Password change failed';
    return { ok: false, error: message };
  }
}
