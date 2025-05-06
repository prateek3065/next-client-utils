"use client";
import { useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOutsideClick = (
  refs: React.RefObject<HTMLElement | null>[],
  callback: (event: Event) => void,
  isActive: boolean
) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: Event) => {
      // Check if the event target is outside all refs
      const isOutsideAll =
        refs instanceof Array
          ? refs?.every(
              (ref) =>
                ref.current && !ref.current.contains(event.target as Node)
            )
          : false;

      if (isOutsideAll) {
        callback(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [refs, callback, isActive]);
};

export default useOutsideClick;
