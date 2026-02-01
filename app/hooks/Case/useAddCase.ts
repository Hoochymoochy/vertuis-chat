import { useState, useCallback } from "react";


export function useAddCase(){
      const [isAdding, setIsAdding] = useState(false);
      
      console.log("🔵 useAddCase render - isAdding:", isAdding);
    
      const toggleAddCase = useCallback(() => {
        console.log("🟢 toggleAddCase CALLED");
        setIsAdding(v => {
          console.log("🟡 setState callback - previous value:", v, "new value:", !v);
          return !v;
        });
      }, []);
    
      return {
        isAdding,
        toggleAddCase,
      };
}
