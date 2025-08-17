import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  User as FirebaseUser,
  onAuthStateChanged,
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  updateProfile,
  getAuth,
  signInWithCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', {
        email: firebaseUser?.email,
        uid: firebaseUser?.uid,
        displayName: firebaseUser?.displayName
      });
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting login process for email:', email);
      
      // Try to sign in with email/password first
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', {
          email: result.user.email,
          uid: result.user.uid,
          displayName: result.user.displayName
        });
        setUser(result.user);
        return;
      } catch (err) {
        // If email/password login fails, check if it's a Google account
        console.log('Email/password login failed, checking for Google account');
        
        // Try to sign in with Google
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result.user.email === email) {
            console.log('Google sign in successful for the same email');
            setUser(result.user);
            return;
          }
        } catch (googleErr) {
          console.log('Google sign in failed:', googleErr);
        }

        // If both attempts fail, check sign-in methods
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log('Available sign-in methods for', email, ':', methods);

        if (methods.length === 0) {
          console.log('No sign-in methods found for email:', email);
          const errorMsg = 'No account found with this email';
          setError(errorMsg);
          return;
        }

        if (methods.includes('google.com')) {
          console.log('Email is associated with Google only:', email);
          const errorMsg = 'This email is associated with a Google account. Please sign in with Google.';
          setError(errorMsg);
          return;
        }

        // If we get here, it means the email exists but the password is wrong
        throw new Error('auth/wrong-password');
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login';
      
      if (err instanceof Error) {
        console.log('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });

        if (err.message.includes('auth/invalid-credential')) {
          errorMessage = 'Invalid email or password';
        } else if (err.message.includes('auth/user-not-found')) {
          errorMessage = 'No account found with this email';
        } else if (err.message.includes('auth/wrong-password')) {
          errorMessage = 'Incorrect password';
        } else if (err.message.includes('auth/too-many-requests')) {
          errorMessage = 'Too many failed login attempts. Please try again later';
        } else if (err.message.includes('This email is associated with a Google account')) {
          errorMessage = 'This email is associated with a Google account. Please sign in with Google.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting signup process for email:', email);
      
      // Check if email is already in use
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log('Sign-in methods for email:', email, ':', methods);
      
      if (methods.length > 0) {
        if (methods.includes('google.com')) {
          console.log('Email is already registered with Google:', email);
          const errorMsg = 'This email is already registered with Google. Please sign in with Google.';
          setError(errorMsg);
          return;
        } else if (methods.includes('password')) {
          console.log('Email already has a password account:', email);
          const errorMsg = 'An account already exists with this email. Please sign in instead.';
          setError(errorMsg);
          return;
        } else {
          console.log('Email has other sign-in methods:', email, methods);
          const errorMsg = 'An account already exists with this email using a different sign-in method.';
          setError(errorMsg);
          return;
        }
      }

      // Create the user account
      console.log('Creating new account for email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', {
        email: result.user.email,
        uid: result.user.uid
      });

      // Update the user's display name
      if (result.user) {
        console.log('Updating profile with name:', name);
        await updateProfile(result.user, {
          displayName: name
        });
        console.log('Profile updated successfully');
        setUser(result.user);
      }
    } catch (err) {
      console.error('Signup error:', err);
      let errorMessage = 'Failed to signup';
      
      if (err instanceof Error) {
        console.log('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });

        if (err.message.includes('auth/email-already-in-use')) {
          errorMessage = 'An account already exists with this email. Please sign in instead.';
        } else if (err.message.includes('auth/weak-password')) {
          errorMessage = 'Password is too weak. Please use a stronger password';
        } else if (err.message.includes('auth/invalid-email')) {
          errorMessage = 'Invalid email address';
        } else if (err.message.includes('This email is already registered with Google')) {
          errorMessage = 'This email is already registered with Google. Please sign in with Google.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting Google sign in process...');
      const result = await signInWithPopup(auth, googleProvider);
      const additionalInfo = getAdditionalUserInfo(result);
      console.log('Google sign in successful:', {
        email: result.user.email,
        uid: result.user.uid,
        displayName: result.user.displayName,
        isNewUser: additionalInfo?.isNewUser
      });
      
      if (additionalInfo?.isNewUser && result.user.displayName) {
        console.log('Updating profile for new Google user');
        await updateProfile(result.user, {
          displayName: result.user.displayName
        });
        console.log('Profile updated successfully');
      }
      
      setUser(result.user);
    } catch (err) {
      console.error('Google sign in error:', err);
      let errorMessage = 'Failed to login with Google';
      
      if (err instanceof Error) {
        console.log('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });

        if (err.message.includes('auth/popup-closed-by-user')) {
          errorMessage = 'Sign in was cancelled';
        } else if (err.message.includes('auth/popup-blocked')) {
          errorMessage = 'Pop-up was blocked by the browser';
        } else if (err.message.includes('auth/account-exists-with-different-credential')) {
          errorMessage = 'An account already exists with this email using a different sign-in method';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting logout process...');
      await auth.signOut();
      console.log('Logout successful');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginAnonymously = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Starting anonymous sign in process...');
      const result = await signInAnonymously(auth);
      console.log('Anonymous sign in successful:', {
        uid: result.user.uid
      });
      setUser(result.user);
    } catch (err) {
      console.error('Anonymous sign in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to login anonymously';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, loginWithGoogle, loginAnonymously }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};