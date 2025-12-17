import { useEffect } from 'react';

export const useQuickAuth = (isInFarcaster?: boolean) => {
  useEffect(() => {
    // placeholder: if inside Farcaster, would trigger quick auth flow
    if (isInFarcaster) {
      // noop
    }
  }, [isInFarcaster]);
};

export default useQuickAuth;
