"use client";
import { RefObject, useEffect, useRef } from "react";

type UseElementPositionChangeProps = {
  element: RefObject<HTMLElement | null> | HTMLElement | null;
  onPositionChange: (rect?: DOMRectReadOnly) => void;
  enabled?: boolean;
  observeMutation?: boolean;
};

export const useElementPositionChange = ({
  element,
  onPositionChange,
  enabled = true,
  observeMutation = true,
}: UseElementPositionChangeProps) => {
  const callbackRef = useRef(onPositionChange);
  callbackRef.current = onPositionChange;

  useEffect(() => {
    if (!enabled) return;

    const target = element instanceof HTMLElement ? element : element?.current;
    if (!target) return;

    const handleChange = () => {
      callbackRef.current(target.getBoundingClientRect());
    };

    // Track size/position changes
    const resizeObserver = new ResizeObserver(handleChange);
    resizeObserver.observe(target);

    // Track DOM mutations (if enabled)
    let mutationObserver: MutationObserver | null = null;
    if (observeMutation) {
      mutationObserver = new MutationObserver(handleChange);
      mutationObserver.observe(target, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // Initial measurement
    handleChange();

    // Track scroll/resize of parent/ancestors
    const scrollableParents = getScrollableParents(target);
    scrollableParents.forEach((parent) => {
      parent.addEventListener("scroll", handleChange, { passive: true });
    });

    window.addEventListener("resize", handleChange);

    return () => {
      resizeObserver.disconnect();
      mutationObserver?.disconnect();
      scrollableParents.forEach((parent) => {
        parent.removeEventListener("scroll", handleChange);
      });
      window.removeEventListener("resize", handleChange);
    };
  }, [element, enabled, observeMutation]);
};

// Helper to find all scrollable parents
const getScrollableParents = (element: HTMLElement): HTMLElement[] => {
  const parents: HTMLElement[] = [];
  let current = element.parentElement;

  while (current) {
    if (
      current.scrollHeight > current.clientHeight ||
      current.scrollWidth > current.clientWidth
    ) {
      parents.push(current);
    }
    current = current.parentElement;
  }

  return parents;
};
