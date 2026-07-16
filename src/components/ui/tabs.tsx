"use client";

import { useState, useCallback, createContext, useContext, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used within <Tabs>");
  return context;
}

interface TabsProps {
  defaultValue: string;
  storageKey?: string;
  className?: string;
  children: React.ReactNode;
}

function Tabs({ defaultValue, storageKey, className, children }: TabsProps) {
  const [activeTab, setActiveTabState] = useState<string>(defaultValue);

  useEffect(() => {
    if (storageKey) {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) setActiveTabState(stored);
    }
  }, [storageKey]);

  const setActiveTab = useCallback(
    (value: string) => {
      setActiveTabState(value);
      if (storageKey) {
        sessionStorage.setItem(storageKey, value);
      }
    },
    [storageKey]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("flex flex-col lg:flex-row lg:gap-6", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

function TabsList({ className, children }: TabsListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex lg:flex-col lg:w-56 shrink-0 gap-1 overflow-x-auto scrollbar-none pb-2 lg:pb-0 lg:pt-0",
        "-mx-4 px-4 sm:mx-0 sm:px-0",
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, icon, className, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={cn(
        "group relative flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "lg:w-full lg:justify-start",
        isActive
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            "size-4 shrink-0 transition-colors duration-200",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/70"
          )}
        >
          {icon}
        </span>
      )}
      {children}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 size-1 rounded-full bg-primary lg:hidden" />
      )}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;
  const ref = useRef<HTMLDivElement>(null);

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state="active"
      className={cn("flex-1 min-w-0 animate-in fade-in-0 zoom-in-95 duration-200", className)}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
