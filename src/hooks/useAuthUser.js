import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../services/platform';

// Waits for Firebase to restore the session (auth.currentUser is null for a moment on refresh).
export default function useAuthUser() {
  const [state, setState] = useState({ user: auth.currentUser, ready: !!auth.currentUser });
  useEffect(
    () => onAuthStateChanged(auth, (u) => setState({ user: u, ready: true })),
    []
  );
  return state;
}
