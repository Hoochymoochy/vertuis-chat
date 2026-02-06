// hooks/Chat/useAutoScroll.ts
import { useEffect, RefObject } from "react";

export function useAutoScroll<T>(
  ref: RefObject<T>,
  deps: unknown[]
) {
  useEffect(() => {
    if (ref.current) {
      // @ts-ignore – DOM only
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, deps);
}
