export type StateType<T> = {
  isPending: boolean;
  document: T | null;
  error: string | null;
  success: boolean;
};

export type ActionType<T> =
  | { type: 'IS_PENDING' }
  | { type: 'ADDED_DOCUMENT'; payload: T }
  | { type: 'DELETED_DOCUMENT' }
  | { type: 'UPDATED_DOCUMENT'; payload: T }
  | { type: 'ERROR'; payload: string };
