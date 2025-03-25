import { User } from 'firebase/auth';

export type AuthContextType = {
  user: User | null;
  isPending: boolean;
  error: string | null;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};
