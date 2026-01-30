import { useCallback, useState } from "react";

export function useAddCase() {
  const [isAdding, setIsAdding] = useState(false);

  const toggleAddCase = useCallback(() => {
    console.log("toggleAddCase");
    console.log("isAdding before:", isAdding);
    setIsAdding(v => !v);
  }, [isAdding]); // Include isAdding in dependencies

  return {
    isAdding,
    toggleAddCase,
  };
}