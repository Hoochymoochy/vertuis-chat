import { useCallback, useState } from "react";

export function useMapUI() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(v => !v);
  }, []);

  return {
    isCollapsed,
    toggleCollapse,
  };
}
