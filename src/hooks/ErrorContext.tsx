import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// Типы уведомлений
interface NotificationMessage {
  id: number;
  message: string;
  type: "error" | "success"; // 🔴 Ошибка или ✅ Успех
}

// Контекст уведомлений
const AddNotificationContext = createContext<(message: string, type?: "error" | "success") => void>(() => {});
const NotificationDataContext = createContext<{ 
  notification: NotificationMessage | null; 
  removeNotification: () => void;
}>({ notification: null, removeNotification: () => {} });

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationMessage | null>(null);

  // Добавление уведомления (по умолчанию — ошибка)
  const addNotification = useCallback((message: string, type: "error" | "success" = "error") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  // Удаление уведомления
  const removeNotification = useCallback(() => {
    setNotifications((prev) => {
      const nextNotification = prev.length > 1 ? prev[1] : null;
      setCurrentNotification(nextNotification);
      return prev.slice(1);
    });
  }, []);

  // Авто-удаление через 5 секунд
  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => removeNotification(), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  // Обновляем текущее уведомление при изменении списка
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
    }
  }, [notifications, currentNotification]);

  return (
    <AddNotificationContext.Provider value={addNotification}>
      <NotificationDataContext.Provider value={{ notification: currentNotification, removeNotification }}>
        {children}
      </NotificationDataContext.Provider>
    </AddNotificationContext.Provider>
  );
};
export const useNotification = () => useContext(AddNotificationContext);
export const useNotificationData = () => useContext(NotificationDataContext);

// 🔴 `useError` по-прежнему работает
export const useError = () => {
  const addNotification = useContext(AddNotificationContext);
  return (message: string) => addNotification(message, "error");
};

// ✅ `useSuccess` теперь тоже работает
export const useSuccess = () => {
  const addNotification = useContext(AddNotificationContext);
  return (message: string) => addNotification(message, "success");
};