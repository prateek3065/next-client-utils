"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type WithModalProps = {
  children: React.ReactNode;
  isModalOpen: boolean;
  overlayStyles?: React.CSSProperties;
  entryOverlayStyleClassName?: string;
  exitOverlayStyleClassName?: string;
  containerStyles?: React.CSSProperties;
  entryStyleClassName?: string;
  exitStyleClassName?: string;
};

export const WithModal: React.FC<WithModalProps> = (props) => {
  const {
    overlayStyles = {},
    containerStyles = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    },
  } = props;

  const [isContainerMounted, setIsContainerMounted] = useState(false);
  const [isOverlayMounted, setIsOverlayMounted] = useState(false);

  // Animation timing control
  useEffect(() => {
    if (props.isModalOpen) {
      setIsContainerMounted(true);
      setIsOverlayMounted(true);
    } else {
      setTimeout(() => setIsContainerMounted(false), 75);
      setTimeout(() => setIsOverlayMounted(false), 300);
    }
  }, [props.isModalOpen]);

  // Dynamic styles with fallbacks
  const overlayBaseStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...overlayStyles,
  };

  const containerBaseStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    transition: "all 0.1s ease",
    ...containerStyles,
  };

  // Animation classes as inline styles
  const getOverlayAnimationStyle = (): React.CSSProperties => {
    return props.isModalOpen
      ? { animation: "fadeIn 0.3s ease-out forwards" }
      : { animation: "fadeOut 0.3s ease-out forwards" };
  };

  const getContainerAnimationStyle = (): React.CSSProperties => {
    return props.isModalOpen
      ? { animation: "scaleIn 0.2s ease-out forwards" }
      : { animation: "scaleOut 0.2s ease-out forwards" };
  };

  return (
    <>
      {isOverlayMounted &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 40,
              }}
            />

            {/* Animated Overlay */}
            <div style={{ ...overlayBaseStyle, ...getOverlayAnimationStyle() }}>
              {isContainerMounted && (
                <div
                  style={{
                    ...containerBaseStyle,
                    ...getContainerAnimationStyle(),
                  }}
                >
                  {props.children}
                </div>
              )}
            </div>

            {/* Embedded CSS Animations */}
            <style>
              {`
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes fadeOut {
                  from { opacity: 1; }
                  to { opacity: 0; }
                }
                @keyframes scaleIn {
                  from { transform: scale(0.95); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                @keyframes scaleOut {
                  from { transform: scale(1); opacity: 1; }
                  to { transform: scale(0.95); opacity: 0; }
                }
                @media (max-width: 768px) {
                  .modalContainer { height: 90vh; }
                }
                @media (max-width: 680px) {
                  .modalContainer { height: 80vh; }
                }
              `}
            </style>
          </>,
          document.body
        )}
    </>
  );
};
