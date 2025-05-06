type IsCenterOnSameLineProps = {
  line: "X" | "Y";
  buttonRect: DOMRect;
  popUpWidth: number;
  popUpHeight: number;
  popUpLeft?: number;
  popUpTop?: number;
};

const isCenterOnSameLine = (props: IsCenterOnSameLineProps): boolean => {
  const {
    line,
    buttonRect,
    popUpWidth,
    popUpHeight,
    popUpLeft = 0,
    popUpTop = 0,
  } = props;
  const tolerance = 7;
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;
  if (line == "Y") {
    const popUpCenterX = popUpLeft + popUpWidth / 2;
    if (Math.abs(buttonCenterX - popUpCenterX) <= tolerance) {
      return true;
    }
    return false;
  } else {
    const popUpCenterY = popUpTop + popUpHeight / 2;
    if (Math.abs(buttonCenterY - popUpCenterY) <= tolerance) {
      return true;
    }
    return false;
  }
};
export default isCenterOnSameLine;
