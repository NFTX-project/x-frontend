import { useCallback, useEffect } from "react";
import keycodes from "./keycodes";

export function useEsc(cb) {
  const handlekeyDown = useCallback(
    (e) => {
      if (e.keyCode === keycodes.esc) {
        cb();
      }
    },
    [cb]
  );
  useEffect(() => {
    window.addEventListener("keydown", handlekeyDown);
    return () => window.removeEventListener("keydown", handlekeyDown);
  }, [handlekeyDown]);
}
