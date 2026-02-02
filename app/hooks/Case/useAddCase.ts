import { useState, useCallback } from "react";


export function useAddCase(){
      const [isAdding, setIsAdding] = useState(false);
      
      const toggleAddCase = () => setIsAdding(v => !v);
    
      return {
        isAdding,
        toggleAddCase,
      };
}
