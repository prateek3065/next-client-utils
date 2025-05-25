"use client";

import { useEffect, useMemo, useState } from "react";
import WithGuidePopupPositioning from "./with-guide-popup-positioning/with-guide-popup-positioning";
import { useNextClientUtilsContext } from "../../../common/use-next-client-util-context/use-next-client-util-context";

type WithGuideProps = {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  GuidPopup: React.FC<GuidePopUpProps>;
  onClick?: (props: any) => any;
  hasSuspense?: boolean;
  elementType?: "div" | "button" | "span";
};

export type GuidePopUpProps = {
  onNextClick: () => void;
  onPrevClick: () => void;
  onExitGuide?: () => void;
  currentIndex?: number | null;
  renderedSideOfPopUp?: "top" | "bottom" | "left" | "right";
};

export const WithGuidePopup: React.FC<WithGuideProps> = (props) => {
  const {
    id,
    className = "",
    GuidPopup,
    onClick,
    hasSuspense = false,
    elementType = "div",
  } = props;

  const [idToIndexMap, setIdToIndexMap] = useState<
    Map<
      string,
      {
        index: number;
        nextId: string | null;
        nextIndex: number | null;
        prevId: string | null;
        prevIndex: number | null;
      }
    >
  >(new Map());

  const { contextState, setContextState } = useNextClientUtilsContext();
  const [showGuide, setShowGuide] = useState(false);

  const isValidId = useMemo(() => {
    const result = contextState.uiGuide?.guides.find((guide) => {
      if (guide.id == id) return guide;
    });
    if (result) return true;
    return false;
  }, [contextState]);

  useEffect(() => {
    if (contextState.uiGuide === undefined) return;
    if (!isValidId) {
      console.error(`${id} not uncluded in useUIGuide hook`);
      return;
    }
    if (hasSuspense) return;
    if (contextState.uiGuide.currentGuideId == id) {
      setShowGuide(true);
      return;
    } else {
      setShowGuide(false);
    }
    const guideState = contextState.uiGuide.guides.find((guide) => {
      if (guide.id == id) return guide;
    });

    if (guideState?.hasUiMounted == true) return;
    setContextState((prevState) => {
      const newState = { ...prevState };
      newState.uiGuide.guides.forEach((guide) => {
        if (guide.id === id) {
          guide.hasUiMounted = true;
        }
      });
      return newState;
    });
  }, [contextState, hasSuspense]);

  const onExitGuide = () => {
    setContextState((prevState) => {
      const newState = { ...prevState };
      newState.uiGuide.currentGuideId = null;
      return newState;
    });
    setShowGuide(false);
  };

  const onPrevClick = () => {
    setContextState((prevState) => {
       if (idToIndexMap.get(id)?.index == 0) return prevState; 
      const newState = { ...prevState };
      let prevGuideIndex: null | number = null;
      for (let i = 0; i < newState.uiGuide.guides.length; i++) {
        if (newState.uiGuide.guides[i].id == id && i != 0) {
          prevGuideIndex = i - 1;
        }
      }
      if (prevGuideIndex != null)
        newState.uiGuide.currentGuideId =
          newState.uiGuide.guides[prevGuideIndex].id;
      else newState.uiGuide.currentGuideId = null;
      return newState;
    });
  };

  const onNextClick = () => {
    setContextState((prevState) => {
      const newState = { ...prevState };
      let nextGuideIndex: null | number = null;
      for (let i = 0; i < newState.uiGuide.guides.length; i++) {
        if (
          newState.uiGuide.guides[i].id == id &&
          i != newState.uiGuide.guides.length - 1
        ) {
          nextGuideIndex = i + 1;
        }
      }
      if (nextGuideIndex != null)
        newState.uiGuide.currentGuideId =
          newState.uiGuide.guides[nextGuideIndex].id;
      else newState.uiGuide.currentGuideId = null;
      return newState;
    });
  };

  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
    transitionProperty: "all",
    top: "0px",
    left: "0px",
  });

  useEffect(() => {
    const newZIndex = contextState.uiGuide?.zIndex;
    if (newZIndex != undefined)
      setPopupStyle((prevStyle) => {
        return { ...prevStyle, zIndex: newZIndex + 1 };
      });
  }, [contextState]);

  const guides = useMemo(() => {
    return contextState.uiGuide?.guides || [];
  }, [contextState]);

  useEffect(() => {
    if (!guides) return;
    const idIndexMap: typeof idToIndexMap = new Map();
    guides.forEach((guide, index) => {
      const info: {
        index: number;
        nextId: string | null;
        nextIndex: number | null;
        prevId: string | null;
        prevIndex: number | null;
      } = {
        index: index,
        nextId: index < guides.length - 1 ? guides[index + 1].id : null,
        nextIndex: index < guides.length - 1 ? index + 1 : null,
        prevId: index > 0 ? guides[index - 1].id : null,
        prevIndex: index > 0 ? index - 1 : null,
      };
      idIndexMap.set(guide.id, info);
    });
    setIdToIndexMap(idIndexMap);
  }, [guides]);

  return (
    <WithGuidePopupPositioning
      id={id}
      currentActiveGuideId={contextState.uiGuide?.currentGuideId}
      elementType={elementType}
      onClick={onClick}
      GuidPopup={GuidPopup}
      className={className}
      guidePopupProps={{
        onNextClick: onNextClick,
        onPrevClick: onPrevClick,
        onExitGuide: onExitGuide,
        currentIndex:
          contextState.uiGuide?.currentGuideId != undefined ||
          contextState.uiGuide?.currentGuideId != null
            ? idToIndexMap.get(contextState.uiGuide.currentGuideId)?.index
            : null,
      }}
      gap={16}
      style={props.style}
      showPopup={showGuide}
      popupStyle={popupStyle}
    >
      {props.children}
    </WithGuidePopupPositioning>
  );
};
