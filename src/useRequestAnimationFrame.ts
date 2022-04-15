import { useCallback, useEffect, useRef } from "react";

export type Props = {
  onAnimation: () => void,
}

export const useRequestAnimationFrame = (props: Props) => {
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame>>();

  const animate = useCallback(() => {
    props.onAnimation();

    requestRef.current = requestAnimationFrame(animate);
  }, [props]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        return cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}
