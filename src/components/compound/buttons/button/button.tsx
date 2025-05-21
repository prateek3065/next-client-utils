"use client";
import React, { ReactNode } from "react";

type ButtonLabelProps =
  | {
      children: React.ReactNode;
      label?: undefined;
    }
  | {
      label: string | ReactNode;
      children?: undefined;
    };

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  dataTestId?: string;
  ariaLabel?: string;
  stopEventPropagation?: boolean;
  onHover?: () => void;
  onUnHover?: () => void;
  style?: React.CSSProperties;
} & ButtonLabelProps;

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    className = "",
    style = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      columnGap: "0.75rem",
      alignItems: "center",
      borderRadius: "0.375rem",
      backgroundColor: "rgb(17, 24, 39)",
      boxShadow: "rgb(0 0 0 / 0.1) 0px 1px 2px, rgb(0 0 0 / 0.06) 0px 1px 3px",
      color: "rgb(255, 255, 255)",
      paddingTop: "0.25rem",
      paddingRight: "0.75rem",
      paddingBottom: "0.25rem",
      paddingLeft: "0.75rem",
      height: "2.25rem",
    },
  } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.stopEventPropagation) {
      e.stopPropagation();
    }
    if (props.onClick) props.onClick();
  };

  const onMouseEnter = () => {
    if (props.onHover) props.onHover();
  };
  const onMouseLeave = () => {
    if (props.onUnHover) props.onUnHover();
  };
  return (
    <button
      data-testid={`${props.dataTestId ?? "button"}`}
      aria-label={`${props.ariaLabel ?? "button"}`}
      className={className}
      onClick={handleClick}
      disabled={props.disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {props.children ? props.children : props.label}
    </button>
  );
};
