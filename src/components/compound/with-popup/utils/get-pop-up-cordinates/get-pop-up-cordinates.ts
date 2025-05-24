import { PopupAlignment } from "../../with-popup";
import getAvailableSide from "../get-available-side/get-available-side";
import isCenterOnSameLine from "../is-center-on-same-line/is-center-on-same-line";

type GetPopUpCordinatesProps = {
  buttonRect: DOMRect;
  popUpRect: DOMRect;
  popupAlignments?: PopupAlignment;
  gap: number;
};
export const getPopUpCordinates = ({
  buttonRect,
  popUpRect,
  popupAlignments,
  gap,
}: GetPopUpCordinatesProps): {
  top: `${number}px` | undefined;
  left: `${number}px` | undefined;
  right: `${number}px` | undefined;
  bottom: `${number}px` | undefined;
  sideRendered: "left" | "right" | "top" | "bottom";
} => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  let availableSide: "left" | "right" | "top" | "bottom" = "bottom";
  if (popupAlignments?.absolutePosition) {
    availableSide = popupAlignments.absolutePosition;
  } else if (!popupAlignments || popupAlignments.position)
    availableSide = getAvailableSide(
      buttonRect,
      !popupAlignments ? undefined : popupAlignments.position
    );
  // Calculate centered positions (default)
  const horizontalCenter =
    buttonRect.left + buttonRect.width / 2 - popUpRect.width / 2;
  const verticalCenter =
    buttonRect.top + buttonRect.height / 2 - popUpRect.height / 2;

  let top: number | undefined = undefined;
  let left: number | undefined = undefined;
  let right: number | undefined = undefined;
  let bottom: number | undefined = undefined;

  switch (availableSide) {
    case "top":
      top = buttonRect.top - popUpRect.height;
      left = Math.max(
        0,
        Math.min(horizontalCenter, windowWidth - popUpRect.width)
      );
      break;

    case "bottom":
      top = buttonRect.bottom;
      left = Math.max(
        0,
        Math.min(horizontalCenter, windowWidth - popUpRect.width)
      );
      break;

    case "left":
      left = buttonRect.left - popUpRect.width;
      top = Math.max(
        0,
        Math.min(verticalCenter, windowHeight - popUpRect.height)
      );
      break;

    case "right":
      left = buttonRect.right;
      top = Math.max(
        0,
        Math.min(verticalCenter, windowHeight - popUpRect.height)
      );
      break;
  }

  // Ensure popup stays within viewport boundaries
  let clampedLeft = Math.max(0, Math.min(left, windowWidth - popUpRect.width));
  let clampedTop = Math.max(0, Math.min(top, windowHeight - popUpRect.height));
  if (availableSide == "top") clampedTop = clampedTop - gap;
  else if (availableSide == "bottom") clampedTop = clampedTop + gap;
  else if (availableSide == "left") clampedLeft = clampedLeft - gap;
  else clampedLeft = clampedLeft + gap;
  if (
    (availableSide == "top" || availableSide == "bottom") &&
    (!isCenterOnSameLine({
      line: "Y",
      buttonRect: buttonRect,
      popUpWidth: popUpRect.width,
      popUpHeight: popUpRect.height,
      popUpLeft: clampedLeft,
      popUpTop: clampedTop,
    }) ||
      popupAlignments?.align)
  ) {
    if (
      getAvailableSide(buttonRect, "X") == "left" &&
      popupAlignments?.align != "left"
    ) {
      // Right edge of popup should be aligned with right edge of button
      right = windowWidth - buttonRect.right;

      return {
        right: `${right}px`,
        top: `${clampedTop}px`,
        left: undefined,
        bottom: undefined,
        sideRendered: availableSide,
      };
    } else {
      // Left edge of popup should be aligned with left edge of button
      left = buttonRect.left;
      return {
        left: `${left}px`,
        top: `${clampedTop}px`,
        right: undefined,
        bottom: undefined,
        sideRendered: availableSide,
      };
    }
  } else if (
    (availableSide == "left" || availableSide == "right") &&
    (!isCenterOnSameLine({
      line: "X",
      buttonRect: buttonRect,
      popUpWidth: popUpRect.width,
      popUpHeight: popUpRect.height,
      popUpLeft: clampedLeft,
      popUpTop: clampedTop,
    }) ||
      popupAlignments?.align)
  ) {
    if (
      getAvailableSide(buttonRect, "Y") == "top" &&
      popupAlignments?.align != "top"
    ) {
      // Bottom edge of popup should be aligned with bottom edge of button
      bottom = windowHeight - buttonRect.bottom;
      return {
        left: `${clampedLeft}px`,
        bottom: `${bottom}px`,
        top: undefined,
        right: undefined,
        sideRendered: availableSide,
      };
    } else {
      // Top edge of popup should be aligned with top edge of button
      top = buttonRect.top;
      return {
        left: `${clampedLeft}px`,
        top: `${top}px`,
        bottom: undefined,
        right: undefined,
        sideRendered: availableSide,
      };
    }
  }

  return {
    top: `${clampedTop}px`,
    left: `${clampedLeft}px`,
    right: undefined,
    bottom: undefined,
    sideRendered: availableSide,
  };
};
export default getPopUpCordinates;
