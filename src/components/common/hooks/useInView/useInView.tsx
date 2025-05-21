import { useEffect, RefObject, useRef } from "react";
import { debounce } from "../../debounce/debounce";

interface IntersectionObserverOptions extends IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number; // Changed to single number only
}

export type InViewDetails = {
  isInView: boolean;
  intersectionRatio: number;
  visibleThreshold: number | null;
  entry?: IntersectionObserverEntry;
};

type UseInViewProps = {
  elementToBeObserved: RefObject<HTMLElement | null>;
  callback: (details: InViewDetails) => void;
  options?: IntersectionObserverOptions;
  isActive?: boolean;
  delay?: number;
  triggerFirstCall?: boolean;
  getAllDetails?: boolean;
};

export const useInView = (props: UseInViewProps): void => {
  const {
    elementToBeObserved,
    callback,
    options = {},
    isActive = true,
    delay = 0,
    triggerFirstCall = false,
    getAllDetails = false,
  } = props;
  const previousState = useRef<InViewDetails | null>(null);

  useEffect(() => {
    if (!isActive || !elementToBeObserved.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      const visibleThreshold =
        entry.intersectionRatio >= (options.threshold ?? 1)
          ? options.threshold ?? 1
          : null;

      const currentDetails: InViewDetails = {
        isInView: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        visibleThreshold,
        entry,
      };

      if (getAllDetails) {
        // Always trigger callback when getAllDetails is true
        callback(currentDetails);
      } else {
        // Only trigger when isInView state changes
        if (
          !previousState.current ||
          previousState.current.isInView !== currentDetails.isInView
        ) {
          callback(currentDetails);
        }
      }

      previousState.current = currentDetails;
    };

    const debouncedCallback = debounce(
      handleIntersection,
      delay,
      triggerFirstCall
    );

    const observer = new IntersectionObserver(debouncedCallback, {
      ...options,
      threshold: [options.threshold ?? 1], // Convert to array internally for Observer
    });

    const currentElement = elementToBeObserved.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [
    elementToBeObserved,
    callback,
    options,
    isActive,
    delay,
    triggerFirstCall,
    getAllDetails,
  ]);
};
