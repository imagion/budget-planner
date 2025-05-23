import { useEffect, useReducer, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActionType, StateType } from '@/types/useFirestoreTypes';

const initialState = <T>(): StateType<T> => ({
  isPending: false,
  document: null,
  error: null,
  success: false,
});

const firestoreReducer = <T>(
  state: StateType<T>,
  action: ActionType<T>,
): StateType<T> => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, error: null, success: false };
    case 'ADDED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        error: null,
        success: true,
      };
    case 'DELETED_DOCUMENT':
      return {
        isPending: false,
        document: null,
        error: null,
        success: true,
      };
    case 'UPDATED_DOCUMENT':
      return {
        isPending: false,
        document: action.payload,
        error: null,
        success: true,
      };
    case 'ERROR':
      return {
        isPending: false,
        document: null,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};
export const useFirestore = <T>(collectionName: string) => {
  const [response, dispatch] = useReducer(
    firestoreReducer<T>,
    initialState<T>(),
  );
  const [isCancelled, setIsCancelled] = useState(false);

  const CollectionRef = collection(db, collectionName);

  const addDocument = async (doc: T): Promise<DocumentReference> => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const addedDocument = await addDoc(CollectionRef, {
        ...doc,
        createdAt: serverTimestamp(),
      });
      if (!isCancelled) {
        dispatch({ type: 'ADDED_DOCUMENT', payload: addedDocument as T });
      }
      return addedDocument;
    } catch (error) {
      if (!isCancelled) {
        dispatch({ type: 'ERROR', payload: (error as Error).message });
      }
      throw error;
    }
  };

  const updateDocument = async (id: string, updatedData: Partial<T>) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, updatedData);
      dispatch({ type: 'UPDATED_DOCUMENT', payload: updatedData as T });
    } catch (error) {
      if (!isCancelled) {
        dispatch({ type: 'ERROR', payload: (error as Error).message });
      }
    }
  };

  const deleteDocument = async (id: string) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      if (!isCancelled) {
        dispatch({ type: 'DELETED_DOCUMENT' });
      }
    } catch (error) {
      if (!isCancelled) {
        dispatch({ type: 'ERROR', payload: (error as Error).message });
      }
    }
  };

  // Cleanup function to prevent unnecessary dispatches if the component unmounts
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
