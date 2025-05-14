"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "../../../common/debounce/debounce";
import ButtonElement from "./button-element/button-element";
import HoverElement from "./hover-element/hover-element";

const DEBOUNCE_DELAY = {
  CLICK: 100,
  HOVER: 300,
};

export type ContainerProps = {
  children: React.ReactNode;
  triggerType: "click" | "hover";
  style?: React.CSSProperties;
  isPopupOpen: boolean;
  triggerMouseEventAction: (isOpen: boolean) => void;
};
const Container: React.FC<ContainerProps> = (props) => {
  const [isOpenRequest, setIsOpeRequest] = useState(false);
  const requestTriggerMouseEventAction = (incIsOpen: boolean) => {
    if (props.isPopupOpen != incIsOpen) {
      props.triggerMouseEventAction(incIsOpen);
    }
    if (isOpenRequest) {
    }
  };

  const debounceDelay = useMemo(() => {
    return props.triggerType == "click"
      ? DEBOUNCE_DELAY.CLICK
      : DEBOUNCE_DELAY.HOVER;
  }, []);

  const onMouseEvent = (hover?: boolean) => {
    setIsOpeRequest((prev) => {
      const newValue = hover == undefined ? !prev : hover;
      debounceClickSideEffect(newValue);
      return newValue;
    });
  };

  const debounceClickSideEffect = useCallback(
    debounce(requestTriggerMouseEventAction, debounceDelay),
    [props.isPopupOpen]
  );

  useEffect(() => {
    if (!props.isPopupOpen) {
      setIsOpeRequest(false);
    }
  }, [props.isPopupOpen]);

  return (
    <>
      {props.triggerType == "click" ? (
        <ButtonElement {...props} onMouseEvent={onMouseEvent} />
      ) : (
        <HoverElement {...props} onMouseEvent={onMouseEvent} />
      )}
    </>
  );
};
export default Container;
