"use client";

import { useEffect, useState } from "react";
import { useNextClientUtilsContext } from "../../common/use-next-client-util-context/use-next-client-util-context";
import { useLimeLightContainer } from "./use-lime-light-container/use-lime-light-contianer";

type UiGuideProps = {
  guideIds: string[];
  zIndex?: number;
};
export const useUIGuide = (props: UiGuideProps) => {
  const { guideIds, zIndex = 20000 } = props;
  const { contextState, setContextState } = useNextClientUtilsContext();
  const [isGuideReady, setIsGuideReady] = useState<boolean>(false);

  useLimeLightContainer({
    id: contextState.uiGuide?.currentGuideId,
    isActive: isGuideReady && contextState.uiGuide.currentGuideId != null,
    zIndex: zIndex,
  });

  const setCurrentGuideId = (guideId: string) => {
    setContextState((prevState) => {
      return {
        ...prevState,
        uiGuide: {
          ...prevState.uiGuide,
          currentGuideId: guideId,
        },
      };
    });
  };

  useEffect(() => {
    setContextState((prevState) => {
      const newState = { ...prevState };
      if (!newState.uiGuide) {
        newState.uiGuide = {
          guides: guideIds.map((id) => {
            return {
              id: id,
              hasUiMounted: false,
            };
          }),
          currentGuideId: null,
          zIndex: zIndex,
        };
      }
      return {
        ...newState,
      };
    });
  }, []);

  useEffect(() => {
    if (isGuideReady) return;
    let isReady = true;
    if (!contextState.uiGuide) return;
    contextState.uiGuide?.guides.forEach((guide) => {
      if (!guide.hasUiMounted) isReady = false;
    });
    if (isReady) setIsGuideReady(true);
  }, [contextState]);

  useEffect(() => {
    if (isGuideReady && guideIds.length > 0) {
      setCurrentGuideId(guideIds[0]);
    }
  }, [isGuideReady]);

  useEffect(() => {
    const main = document.querySelector("main");

    if (!main) return; // safeguard

    if (contextState.uiGuide?.currentGuideId) {
      // Apply pointer-events: none
      main.style.pointerEvents = "none";
    } else {
      // Revert back
      main.style.pointerEvents = "";
    }

    // Cleanup in case the component unmounts
    return () => {
      main.style.pointerEvents = "";
    };
  }, [contextState]);
};
