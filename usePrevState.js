import { useRef, useEffect } from 'react';

function usePrevState(state) {
  const prevStateRef = useRef();
  useEffect(() => {
    prevStateRef.current = state;
  });
  return prevStateRef.current;
}

export default usePrevState;