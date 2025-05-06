'use client";';
import { ContainerProps } from "../container";

const HoverElement: React.FC<
  ContainerProps & {
    onMouseEvent: (hover: boolean) => void;
  }
> = (props) => {
  const onMouseOverEvent = () => {
    props.onMouseEvent(true);
  };
  const onMouseOutEvent = () => {
    props.onMouseEvent(false);
  };
  return (
    <div
      style={props.style}
      onMouseOver={onMouseOverEvent}
      onMouseOut={onMouseOutEvent}
    >
      {props.children}
    </div>
  );
};
export default HoverElement;
