import { useEffect, useRef, useState } from "react";

import animationData100 from "../video/assets/courseComplete_100.json";
import animationData20 from "../video/assets/courseComplete_20.json";
import animationData40 from "../video/assets/courseComplete_40.json";
import animationData60 from "../video/assets/courseComplete_60.json";
import animationData80 from "../video/assets/courseComplete_80.json";

export const useLottieHighLight = (courseAttendanceRate: number) => {
  const prevValueRef = useRef<number>(courseAttendanceRate);

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [animationData, setAnimationData] = useState<any>();

  useEffect(() => {
    if (prevValueRef.current !== courseAttendanceRate) {
      setIsHighlighted(true);

      // 애니메이션 선택
      const percent = courseAttendanceRate * 100;
      switch (percent) {
        case 20:
          setAnimationData(animationData20);
          break;
        case 40:
          setAnimationData(animationData40);
          break;
        case 60:
          setAnimationData(animationData60);
          break;
        case 80:
          setAnimationData(animationData80);
          break;
        case 100:
          setAnimationData(animationData100);
          break;
        default:
          setAnimationData(undefined);
      }

      const timeout = setTimeout(() => setIsHighlighted(false), 2000);
      prevValueRef.current = courseAttendanceRate;

      return () => clearTimeout(timeout);
    }
  }, [courseAttendanceRate]);

  return { isHighlighted, animationData };
};
