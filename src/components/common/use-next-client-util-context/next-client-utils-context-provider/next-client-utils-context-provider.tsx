"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type NextClientUtilsContextType = {
  contextState: {
    uiGuide: {
      guides: Array<{
        id: string;
        hasUiMounted: boolean;
      }>;
      currentGuideId: string | null;
      zIndex: number;
    };
  }; // Replace 'any' with your specific state type
  setContextState: Dispatch<
    SetStateAction<NextClientUtilsContextType["contextState"]>
  >;
};

// 2. Create context with proper typing and default value
export const NextClientUtilsContext = createContext<
  NextClientUtilsContextType | undefined
>(undefined);

// 3. Define props type for the provider
type NextClientUtilsProviderProps = {
  children: ReactNode;
  initialState?: any; // Optional initial state with proper type
};

export function NextClientUtilsContextProvider({
  children,
  initialState = {}, // Default initial state
}: NextClientUtilsProviderProps) {
  const [contextState, setContextState] =
    useState<NextClientUtilsContextType["contextState"]>(initialState);

  const value = {
    contextState,
    setContextState: setContextState,
  };

  return (
    <NextClientUtilsContext.Provider value={value}>
      {children}
    </NextClientUtilsContext.Provider>
  );
}
