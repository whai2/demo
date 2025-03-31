import { useLayoutEffect, useRef } from "react";

type ControlScrollProps = {
  data: any;
};

export const useAutoScroll = ({ data }: ControlScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [data]);

  return { containerRef };
};
