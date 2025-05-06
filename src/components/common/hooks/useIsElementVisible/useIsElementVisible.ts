"use client";
import { RefObject, useEffect, useRef } from "react";

interface UseIsElementVisibleProps {
  elementRef: RefObject<HTMLElement | null> | HTMLElement;
  checkInterval?: number;
  onVisibilityChange?: (isVisible: boolean) => void;
  isHookActive?: boolean;
}

export const useIsElementVisible = ({
  elementRef,
  checkInterval = 200,
  onVisibilityChange,
  isHookActive = true, // Default to active if not specified
}: UseIsElementVisibleProps) => {
  const visibilityRef = useRef(false);
  const callbackRef = useRef(onVisibilityChange);
  callbackRef.current = onVisibilityChange;

  useEffect(() => {
    if (!isHookActive) return; // Early exit if hook is inactive

    const element =
      elementRef instanceof HTMLElement ? elementRef : elementRef.current;
    if (!element) return;

    const checkVisibility = () => {
      // 1. Check if CSS hides the element
      const style = window.getComputedStyle(element);
      const isStyleVisible =
        style.opacity !== "0" &&
        style.visibility !== "hidden" &&
        style.display !== "none";

      // 2. Check if in viewport
      const rect = element.getBoundingClientRect();
      const isInViewport =
        rect.top <= window.innerHeight &&
        rect.bottom >= 0 &&
        rect.left <= window.innerWidth &&
        rect.right >= 0;

      // 3. Check if another element is covering it
      const isTopmost = isElementTopmost(element);

      const isVisible = isStyleVisible && isInViewport && isTopmost;

      // Only update and call callback if visibility changed
      if (isVisible !== visibilityRef.current) {
        visibilityRef.current = isVisible;
        callbackRef.current?.(isVisible);
      }
    };

    // Initial check
    checkVisibility();

    // Set up periodic checks if active
    const interval = isHookActive
      ? setInterval(checkVisibility, checkInterval)
      : undefined;

    // Track DOM mutations if active
    const mutationObserver = isHookActive
      ? new MutationObserver(checkVisibility)
      : undefined;
    mutationObserver?.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "id"],
    });

    // Track window events if active
    const passiveOptions = { passive: true };
    if (isHookActive) {
      window.addEventListener("scroll", checkVisibility, passiveOptions);
      window.addEventListener("resize", checkVisibility, passiveOptions);
    }

    return () => {
      clearInterval(interval);
      mutationObserver?.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, [elementRef, checkInterval, isHookActive]); // Add isHookActive to dependencies

  function isElementTopmost(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const topElement = document.elementFromPoint(centerX, centerY);
    return element === topElement || element.contains(topElement);
  }
};

export default useIsElementVisible;
