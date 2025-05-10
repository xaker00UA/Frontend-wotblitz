import React, { createContext, ReactNode, useContext, useState } from "react";
import { APIRestUser } from "../api/generated";

// 1. Создаем контекст
const StatsContext = createContext<{
  generalData: APIRestUser | null;
  detailsData: APIRestUser | null;
  setGeneralData: (data: APIRestUser | null) => void;
  setDetailsData: (data: APIRestUser | null) => void;
} | null>(null);

// 2. Провайдер контекста

type StatsProviderProps = {
  children: ReactNode;
};

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [generalData, setGeneralData] = useState<APIRestUser | null>(null);
  const [detailsData, setDetailsData] = useState<APIRestUser | null>(null);

  return (
    <StatsContext.Provider
      value={{ generalData, detailsData, setGeneralData, setDetailsData }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    // Возвращаем заглушки
    return {
      generalData: null,
      detailsData: null,
      setGeneralData: () => {},
      setDetailsData: () => {},
    };
  }
  return context;
};
