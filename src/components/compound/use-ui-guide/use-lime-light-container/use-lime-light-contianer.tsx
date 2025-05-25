"use client";

import { useEffect, useRef } from "react";
import { useOverlay } from "./use-overlay/use-overlay";

type LimeLightContainerProps = {
  id: string | null;
  overlayBackgroundColor?: string;
  isActive?: boolean;
  zIndex: number;
};

export const useLimeLightContainer = (props: LimeLightContainerProps) => {
  const { id, zIndex, overlayBackgroundColor, isActive = true } = props;

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const limeLightContainerRef = useRef<HTMLDivElement | null>(null);

  useOverlay({
    overlayRef,
    zIndex,
    overlayBackgroundColor,
    isActive, // Pass isActive to useOverlay
  });

  useEffect(() => {
    if (!isActive) {
      limeLightContainerRef.current?.remove();
      limeLightContainerRef.current = null;
      return;
    } // Do nothing if inactive or no ID
    if (!id) return;
  }, [id, zIndex, isActive]);

  useEffect(() => {
    return () => {
      limeLightContainerRef.current?.remove();
      limeLightContainerRef.current = null;
    };
  }, []);
};
