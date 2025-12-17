import { useCallback } from 'react';

export const useAddMiniApp = () => {
  const addMiniApp = useCallback(async () => {
    // placeholder: no-op for local dev
    return Promise.resolve();
  }, []);

  return { addMiniApp };
};

export default useAddMiniApp;
