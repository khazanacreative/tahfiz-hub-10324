import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
  });

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [key]: value },
      errors: { ...prev.errors, [key]: undefined },
    }));
  }, []);

  const updateValues = useCallback((updates: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, ...updates },
    }));
  }, []);

  const setError = useCallback(<K extends keyof T>(key: K, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: error },
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
    });
  }, [initialValues]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    try {
      await onSubmit(state.values);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.values]);

  return {
    values: state.values,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    setValue,
    updateValues,
    setError,
    reset,
    handleSubmit,
  };
}

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, setIsOpen, open, close, toggle };
}
