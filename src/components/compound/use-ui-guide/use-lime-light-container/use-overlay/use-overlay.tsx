"use client";
import { MutableRefObject, useEffect } from "react";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  // backgroundColor: 'rgba(0, 0, 0, 0.6)',
  pointerEvents: "none",
  transition: "all 0.3s ease",
};
type OverlayProps = {
  overlayRef: MutableRefObject<HTMLDivElement | null>;
  isActive?: boolean;
  overlayBackgroundColor?: string;
  zIndex?: number;
};
export const useOverlay = (props: OverlayProps) => {
  const {
    overlayRef,
    isActive = true,
    overlayBackgroundColor = "rgba(0, 0, 0, 0.6)",
    zIndex = 9999,
  } = props;

  const applyBgColor = () => {
    setTimeout(() => {
      overlayRef.current?.style.setProperty(
        "background-color",
        overlayBackgroundColor
      );
    }, 10);
  };

  useEffect(() => {
    if (!isActive) return; // Do nothing if not active

    // Create and append overlay
    const overlay = document.createElement("div");
    Object.assign(overlay.style, { ...overlayStyle, zIndex });
    document.body.appendChild(overlay);
    overlayRef.current = overlay;
    applyBgColor();

    // Cleanup
    return () => {
      overlayRef.current?.remove();
      overlayRef.current = null;
    };
  }, [isActive]);
};
