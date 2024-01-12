import { useRef, useEffect } from "react";

export const useClickOutside = (handler: () => void) => {
    const ref = useRef<HTMLElement | null>(null);
  
    const handleClickOutside = (event : MouseEvent) => {
      if (ref.current && !ref.current?.contains(event.target as Node)) {
        handler();
      }
    }
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handler]);
  
    return ref;  
    };

