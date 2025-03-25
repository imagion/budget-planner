'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { AuthContextType } from '@/types/AuthContextType';
import { ChildrenProps } from '@/types/general';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Следим за изменением состояния пользователя
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsPending(false);
    });
    return () => unsub(); // Отписываемся при размонтировании
  }, []);

  // Метод для регистрации
  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setIsPending(true);
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Обновляем профиль пользователя и сохраняем его в базе данных
      if (res.user) {
        await updateProfile(res.user, { displayName });
        setUser({ ...res.user, displayName });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  // Метод для входа
  const login = async (email: string, password: string) => {
    setIsPending(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  // Метод для входа через Google
  const loginWithGoogle = async () => {
    setIsPending(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      setUser(res.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  // Метод для выхода
  const logout = async () => {
    setIsPending(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Кастомный хук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
