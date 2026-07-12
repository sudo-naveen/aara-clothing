"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface DashboardRefreshContextValue {
  refreshKey: number;
  requestRefresh: () => void;
}

const DashboardRefreshContext = createContext<DashboardRefreshContextValue>({
  refreshKey: 0,
  requestRefresh: () => {},
});

export function useDashboardRefresh() {
  return useContext(DashboardRefreshContext);
}

export function DashboardRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const requestRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <DashboardRefreshContext.Provider value={{ refreshKey, requestRefresh }}>
      {children}
    </DashboardRefreshContext.Provider>
  );
}
