import { useContext } from "react";
import { NextClientUtilsContext } from "./next-client-utils-context-provider/next-client-utils-context-provider";
export function useNextClientUtilsContext() {
  const context = useContext(NextClientUtilsContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
}
