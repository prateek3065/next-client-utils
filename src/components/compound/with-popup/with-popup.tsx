"use client";
import {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useElementPositionChange } from "../../common/hooks/useElementPositionChange/useElementPositionChange";
import useIsElementVisible from "../../common/hooks/useIsElementVisible/useIsElementVisible";
import useOutsideClick from "../../common/hooks/useOutsideClick/useOutsideClick";
import Container from "./container/container";
import { debounce } from "../../common/debounce/debounce";
import getPopUpCordinates from "./utils/get-pop-up-cordinates/get-pop-up-cordinates";

export type PopupAlignment =
  | { position: "X"; align?: "top" | "bottom"; absolutePosition?: undefined }
  | { position: "Y"; align?: "left" | "right"; absolutePosition?: undefined }
  | { absolutePosition: "top"; align?: "left" | "right"; position?: undefined }
  | {
      absolutePosition: "bottom";
      align?: "left" | "right";
      position?: undefined;
    }
  | { absolutePosition: "left"; align?: "top" | "bottom"; position?: undefined }
  | {
      absolutePosition: "right";
      align?: "top" | "bottom";
      position?: undefined;
    };

export type TriggerType = "click" | "hover";

type PopupType<P extends Record<string, unknown>> =
  | {
      PopUp: FC<P>;
      renderSSRPopUp?: never; // Use 'never' instead of undefined for stricter typing
      loadingJSX?: never;
    }
  | {
      PopUp?: never;
      renderSSRPopUp: (props: P) => Promise<ReactNode>;
      loadingJSX?: ReactNode;
    };

export type WithPopupProps<P extends Record<string, unknown>> = {
  children: ReactNode;
  popupProps: P;
  triggerType?: TriggerType;
  buttonContainerStyle?: CSSProperties;
  popupContainerStyle?: CSSProperties;
  popupAlignments?: PopupAlignment;
  gap?: number;
  id?: string;
  childrenWrapperComponent?: React.FC<{
    isPopUpActive: boolean;
    children: React.ReactNode;
  }>;
  closeOnOutsideClick?: boolean;
} & PopupType<P>;

type WithPopupState = {
  isPopupOpen: boolean;
  stateId: number;
  popupContainerStyle: CSSProperties;
};

export const WithPopup = <P extends Record<string, unknown>>(
  props: WithPopupProps<P>
) => {
  const {
    children,
    PopUp,
    loadingJSX,
    triggerType = "click",
    buttonContainerStyle,
    closeOnOutsideClick = true,
    popupContainerStyle = {
      position: "fixed",
      visibility: "hidden",
      zIndex: 30,
      transitionProperty: "all",
      transitionTtimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      //   transitionDuration: '150ms',
      top: "0px",
      left: "0px",
    },
  } = props;
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const popUpContainerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<WithPopupState>({
    stateId: 1,
    isPopupOpen: false,
    popupContainerStyle: popupContainerStyle,
  });

  const triggerMouseEventAction = (isOpen: boolean) => {
    if (props.renderSSRPopUp) {
      setSSRPopUpJSX(loadingJSX);
      setState((prev) => {
        return { ...prev, isPopupOpen: isOpen, stateId: 2 };
      });
      if (isOpen)
        props.renderSSRPopUp(props.popupProps).then((res) => {
          setSSRPopUpJSX(res);
        });
    } else
      setState((prev) => {
        return { ...prev, isPopupOpen: isOpen, stateId: 2 };
      });
  };

  const setPopUpDimensions = useCallback(
    debounce(() => {
      const buttonRect = buttonContainerRef.current?.getBoundingClientRect();
      const popUpRect = popUpContainerRef.current?.getBoundingClientRect();
      if (buttonRect && popUpRect) {
        const { top, left, right, bottom } = getPopUpCordinates({
          buttonRect: buttonRect,
          popUpRect: popUpRect,
          popupAlignments: props.popupAlignments,
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
          newState.stateId = 3;
          return newState;
        });
      }
    }, 50),
    [buttonContainerRef, popUpContainerRef]
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
        popupContainerStyle: popupContainerStyle,
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
    element: buttonContainerRef,
    onPositionChange: onButtonPositionChange,
    enabled: state.isPopupOpen,
  });

  const onBtnVisibilityChange = useCallback(
    debounce(
      (isVisible: boolean) => {
        if (!isVisible) {
          setState((prev) => {
            return { ...prev, isPopupOpen: false };
          });
        }
      },
      300,
      true
    ),
    []
  );

  useIsElementVisible({
    elementRef: buttonContainerRef,
    onVisibilityChange: onBtnVisibilityChange,
    isHookActive: state.isPopupOpen,
  });

  const onOutsideClick = useCallback(() => {
    setState((prev) => {
      return { ...prev, isPopupOpen: false };
    });
  }, []);

  useOutsideClick(
    [buttonContainerRef, popUpContainerRef],
    onOutsideClick,
    state.isPopupOpen && closeOnOutsideClick
  );

  const [ssrPopUpJSX, setSSRPopUpJSX] = useState<React.ReactNode>(loadingJSX);

  useEffect(() => {
    if (!state.isPopupOpen && props.renderSSRPopUp != undefined) {
      setSSRPopUpJSX(loadingJSX);
    }
  }, [state.isPopupOpen]);

  const onMouseEnterPopup = () => {};

  const onMouseLeavePopup = () => {};

  return (
    <>
      <Container
        style={buttonContainerStyle}
        triggerType={triggerType}
        triggerMouseEventAction={triggerMouseEventAction}
        isPopupOpen={state.isPopupOpen}
      >
        <div ref={buttonContainerRef} style={buttonContainerStyle}>
          {props.childrenWrapperComponent ? (
            <props.childrenWrapperComponent isPopUpActive={state.isPopupOpen}>
              {children}
            </props.childrenWrapperComponent>
          ) : (
            children
          )}
        </div>
      </Container>
      {state.isPopupOpen
        ? createPortal(
            <div
              ref={popUpContainerRef}
              style={state.popupContainerStyle}
              onMouseEnter={onMouseEnterPopup}
              onMouseLeave={onMouseLeavePopup}
            >
              {PopUp ? <PopUp {...props.popupProps} /> : <>{ssrPopUpJSX}</>}
            </div>,
            document.body
          )
        : null}
    </>
  );
};
