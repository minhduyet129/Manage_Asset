import { useEffect, useCallback } from "react";

function useDebounce(cb, delay, depens) {
  const _cb = useCallback(cb, depens);
  useEffect(() => {
    const timer = setTimeout(_cb, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [_cb, delay]);
}
export default useDebounce;
