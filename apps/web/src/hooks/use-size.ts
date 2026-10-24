// use-size.ts
//
// Measures an element's bounding rect and updates on resize using a
// ResizeObserver. Uses useLayoutEffect so the first measurement lands
// before the browser paints — critical for responsive images that need
// the correct srcset on the very first frame.

import { useLayoutEffect, useState, useRef } from "react";
import type { RefObject } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

export function useSize(ref: RefObject<HTMLElement | null>): ElementSize | null {
  const [size, setSize] = useState<ElementSize | null>(null);

  // useLayoutEffect (not useEffect): the initial measurement must land before
  // the browser paints, so consumers can render their real content on the
  // very first painted frame instead of a guess. A ResizeObserver's first
  // callback arrives too late for that — by then an <img> src guess has
  // already been dispatched to the network.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}