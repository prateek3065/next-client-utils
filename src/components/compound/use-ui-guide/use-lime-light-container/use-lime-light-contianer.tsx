"use client";

import { useEffect, useRef } from "react";
import { useOverlay } from "./use-overlay/use-overlay";

type LimeLightContainerProps = {
  id: string | null;
  zIndex?: number;
  overlayBackgroundColor?: string;
  isActive?: boolean;
};

export const useLimeLightContainer = (props: LimeLightContainerProps) => {
  const { id, zIndex = 9999, overlayBackgroundColor, isActive = true } = props;

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
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.style.setProperty("z-index", (zIndex + 1).toString());
    }
  }, [id, zIndex, isActive]);

  useEffect(() => {
    return () => {
      limeLightContainerRef.current?.remove();
      limeLightContainerRef.current = null;
    };
  }, []);
};
