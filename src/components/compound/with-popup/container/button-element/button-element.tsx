'use client";';
import { ContainerProps } from "../container";

const ButtonElement: React.FC<
  ContainerProps & {
    onMouseEvent: () => void;
  }
> = (props) => {
  const { onMouseEvent } = props;
  const onClick = () => {
    onMouseEvent();
  };
  return (
    <button style={props.style} onClick={onClick}>
      {props.children}
    </button>
  );
};
export default ButtonElement;
