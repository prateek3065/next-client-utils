"use client";

import { useCallback, useRef, useState, CSSProperties, useEffect } from "react";
import { createPortal } from "react-dom";
import { debounce, useElementPositionChange } from "../../../../common";
import getPopUpCordinates from "../../../with-popup/utils/get-pop-up-cordinates/get-pop-up-cordinates";
import { GuidePopUpProps } from "../with-guide-popup";

type State = {
  isPopupOpen: boolean;
  stateId: number;
  popupContainerStyle: CSSProperties;
  renderedSideOfPopUp: "top" | "bottom" | "left" | "right" | null;
};

type WithGuidePopupPositioningProps = {
  children: React.ReactNode;
  GuidPopup: React.FC<GuidePopUpProps>;
  guidePopupProps: GuidePopUpProps;
  showPopup: boolean;
  className?: string;
  style?: React.CSSProperties;
  popupStyle: React.CSSProperties;
  gap?: number;
  id: string;

  elementType?: "div" | "button" | "span";
  onClick?: ((props: any) => any) | undefined;
};

const WithGuidePopupPositioning: React.FC<WithGuidePopupPositioningProps> = (
  props
) => {
  const {
    elementType,
    children,
    id,
    GuidPopup,
    guidePopupProps,
    showPopup,
    style,
    popupStyle,
    className,
  } = props;
  const [state, setState] = useState<State>({
    stateId: 1,
    isPopupOpen: false,
    popupContainerStyle: popupStyle,
    renderedSideOfPopUp: null,
  });
  const popUpContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const triggerOpenAction = (isOpen: boolean) => {
    setState((prev) => {
      return { ...prev, isPopupOpen: isOpen, stateId: 2 };
    });
  };

  const setPopUpDimensions = useCallback(
    debounce(() => {
      const buttonRect = mainContainerRef.current?.getBoundingClientRect();
      const popUpRect = popUpContainerRef.current?.getBoundingClientRect();
      if (buttonRect && popUpRect) {
        const { top, left, right, bottom, sideRendered } = getPopUpCordinates({
          buttonRect: buttonRect,
          popUpRect: popUpRect,
          popupAlignments: undefined,
          gap: props.gap != undefined ? props.gap : 8,
        });
        setState((prevState) => {
          const newState = { ...prevState };
          newState.popupContainerStyle = {
            ...prevState.popupContainerStyle,
            visibility: "visible",
            top: top,
            left: left,
            right: right,
            bottom: bottom,
          };
          newState.renderedSideOfPopUp = sideRendered;
          newState.stateId = 3;
          return newState;
        });
      }
    }, 50),
    [mainContainerRef, popUpContainerRef]
  );

  useEffect(() => {
    if (state.stateId == 2) {
      setPopUpDimensions();
    }
  }, [state]);

  useEffect(() => {
    if (!state.isPopupOpen) {
      setState({
        stateId: 1,
        isPopupOpen: false,
        popupContainerStyle: popupStyle,
        renderedSideOfPopUp: null,
      });
    }
  }, [state.isPopupOpen]);

  const onButtonPositionChange = useCallback(
    debounce(() => {
      setState((prev) => {
        if (prev.isPopupOpen)
          return {
            ...prev,
            popupContainerStyle: {
              ...prev.popupContainerStyle,
              transitionDuration: "150ms",
            },
          };
        return prev;
      });
      setPopUpDimensions();
    }, 100),
    []
  );

  useElementPositionChange({
    element: mainContainerRef,
    onPositionChange: onButtonPositionChange,
    enabled: state.isPopupOpen,
  });

  useEffect(() => {
    if (showPopup && !state.isPopupOpen) {
      triggerOpenAction(true);
    } else if (!showPopup && state.isPopupOpen) {
      triggerOpenAction(false);
    }
  }, [showPopup]);

  return (
    <>
      {elementType == "div" ? (
        <div
          ref={mainContainerRef}
          id={id}
          style={style}
          className={className}
          onClick={props.onClick}
        >
          {children}
        </div>
      ) : null}
      {elementType == "span" ? (
        <span
          ref={mainContainerRef}
          className={className}
          id={id}
          style={style}
          onClick={props.onClick}
        >
          {children}
        </span>
      ) : null}
      {elementType == "button" ? (
        <button
          ref={mainContainerRef as unknown as any}
          className={className}
          id={id}
          style={style}
          onClick={props.onClick}
        >
          {children}
        </button>
      ) : null}
      {state.isPopupOpen
        ? createPortal(
            <div ref={popUpContainerRef} style={state.popupContainerStyle}>
              <GuidPopup
                {...guidePopupProps}
                renderedSideOfPopUp={
                  state.renderedSideOfPopUp as GuidePopUpProps["renderedSideOfPopUp"]
                }
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
};
export default WithGuidePopupPositioning;
