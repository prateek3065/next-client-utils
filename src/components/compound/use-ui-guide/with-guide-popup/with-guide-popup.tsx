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
  onExitGuide: () => void;
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
  const [style, setStyle] = useState<React.CSSProperties>(props.style ?? {});
  const prevStyle = useMemo(() => {
    return { ...props.style };
  }, []);

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
      setStyle((prevStyle) => {
        return {
          ...prevStyle,
          zIndex: contextState.uiGuide.zIndex,
          position: "relative",
          pointerEvents: "none",
        };
      });
      setShowGuide(true);
      return;
    } else {
      setStyle({ ...prevStyle, pointerEvents: "unset" });
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

  return (
    <WithGuidePopupPositioning
      id={id}
      elementType={elementType}
      onClick={onClick}
      GuidPopup={GuidPopup}
      className={className}
      guidePopupProps={{
        onNextClick: onNextClick,
        onPrevClick: () => {},
        onExitGuide: () => {},
      }}
      gap={16}
      style={style}
      showPopup={showGuide}
      popupStyle={{
        position: "fixed",
        visibility: "hidden",
        zIndex: contextState.uiGuide ? contextState.uiGuide.zIndex + 1 : 10000,
        transitionProperty: "all",
        // transitionTtimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        //   transitionDuration: '150ms',
        top: "0px",
        left: "0px",
      }}
    >
      {props.children}
    </WithGuidePopupPositioning>
  );
};
