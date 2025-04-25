import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// Тип для ошибки
interface ErrorMessage {
  id: number;
  message: string;
}

// Контексты для добавления и удаления ошибок
const AddErrorContext = createContext<(msg: string) => void>(() => {});
const ErrorDataContext = createContext<{
  error: ErrorMessage | null;
  removeError: () => void;
}>({ error: null, removeError: () => {} });

// Провайдер для ошибок
export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [currentError, setCurrentError] = useState<ErrorMessage | null>(null);
  // Мемоизация добавления ошибки
  const addError = useCallback((message: string) => {
    const id = Date.now();
    setErrors((prev) => {
      if (prev.some((err) => err.message === message)) return prev;
      return [...prev, { id, message }];
    });
  }, []);
  // Мемоизация удаления ошибки
  const removeError = useCallback(() => {
    setErrors((prev) => {
      const nextError = prev.length > 1 ? prev[1] : null;
      setCurrentError(nextError);
      return prev.slice(1); // Удаляем первую ошибку и показываем следующую
    });
  }, []);

  useEffect(() => {
    if (errors.length > 0 && !currentError) {
      setCurrentError(errors[0]);
    }
  }, [errors, currentError]);

  return (
    <AddErrorContext.Provider value={addError}>
      <ErrorDataContext.Provider value={{ error: currentError, removeError }}>
        {children}
      </ErrorDataContext.Provider>
    </AddErrorContext.Provider>
  );
};

// Хук для добавления ошибок (для всех компонентов)
export const useError = () => useContext(AddErrorContext);

// Хук для получения ошибок и их удаления (для ErrorSnackbar)
export const useErrorData = () => useContext(ErrorDataContext);
