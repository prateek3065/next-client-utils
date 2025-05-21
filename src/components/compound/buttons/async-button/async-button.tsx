"use client";

import React, { useState } from "react";
import { Button } from "../button/button";
import { LoadingDots } from "../../loaders/loading-dots/loading-dots";

export type AsyncButtonProps = {
  loader?: React.ReactNode;
  children: React.ReactNode | string;
  className?: string;
  serverRequest: () => Promise<any>;
  onSuccess: (res: any, eventData?: any) => void;
  disabled?: boolean;
  loadingBallCount?: 1 | 2 | 3;
  loadingBallColor?: "black" | "white";
  eventData?: any;
  stopEventPropagation?: boolean;
} & {
  onFailure: (
    err?: string | React.ReactNode,
    eventData?: any,
    res?: any
  ) => void;
};
export const AsyncButton: React.FC<AsyncButtonProps> = (props) => {
  const [isClickActionRunning, setIsClickActionRunning] = useState(false);
  const {
    loader = (
      <LoadingDots
        numberOfJumpingBalls={props.loadingBallCount ?? 3}
        ballColor={props.loadingBallColor ?? undefined}
      />
    ),
  } = props;
  const { disabled = false } = props;
  const oldErrorHandlingMethod = (res: any) => {
    if (res.errors)
      res.errors.forEach((err: string) => {
        props.onFailure?.(JSON.stringify(err), props.eventData, res);
      });
    if (res.error)
      props.onFailure?.(JSON.stringify(res.error), props.eventData, res);
    if (res.message) props.onFailure?.(res.message, props.eventData, res);
  };
  const handleApiFailure = (res: any) => {
    oldErrorHandlingMethod(res);
  };
  const handleClick = () => {
    if (!isClickActionRunning && !disabled) {
      setIsClickActionRunning(true);
      props
        .serverRequest()
        .then((res) => {
          if (res?.success) props.onSuccess(res, props.eventData);
          else {
            handleApiFailure(res);
          }
        })
        .catch((err) => {
          console.error(err);
          handleApiFailure({
            res: {
              error: JSON.stringify(err),
            },
          });
        })
        .finally(() => {
          setIsClickActionRunning(false);
        });
    }
  };
  return (
    <Button
      onClick={handleClick}
      className={props.className}
      disabled={disabled}
      stopEventPropagation={props.stopEventPropagation}
    >
      {isClickActionRunning ? loader : props.children}
    </Button>
  );
};
