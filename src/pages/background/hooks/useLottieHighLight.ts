import { useEffect, useRef, useState } from "react";

import animationData20 from "../video/assets/courseComplete_20.json";
import animationData40 from "../video/assets/courseComplete_40.json";
import animationData60 from "../video/assets/courseComplete_60.json";
import animationData80 from "../video/assets/courseComplete_80.json";
import animationData100 from "../video/assets/courseComplete_100.json";
import englishAnimationData20 from "../video/assets/courseCompleteEnglish_20.json";
import englishAnimationData40 from "../video/assets/courseCompleteEnglish_40.json";
import englishAnimationData60 from "../video/assets/courseCompleteEnglish_60.json";
import englishAnimationData80 from "../video/assets/courseCompleteEnglish_80.json";
import englishAnimationData100 from "../video/assets/courseCompleteEnglish_100.json";

export const useLottieHighLight = (courseAttendanceRate: number, isEnglish: boolean) => {
  const prevValueRef = useRef<number>(courseAttendanceRate);

  const [isHighlighted, setIsHighlighted] = useState(false);
  const [animationData, setAnimationData] = useState<any>();

  useEffect(() => {
    if (prevValueRef.current !== courseAttendanceRate && !isEnglish) {
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
          return;
      }

      const timeout = setTimeout(() => setIsHighlighted(false), 2000);
      prevValueRef.current = courseAttendanceRate;

      return () => clearTimeout(timeout);
    }

    if (prevValueRef.current !== courseAttendanceRate && isEnglish) {
      setIsHighlighted(true);
      
      const percent = courseAttendanceRate * 100;
      switch (percent) {
        case 20:
          setAnimationData(englishAnimationData20);
          break;
        case 40:
          setAnimationData(englishAnimationData40);
          break;
        case 60:
          setAnimationData(englishAnimationData60);
          break;
        case 80:
          setAnimationData(englishAnimationData80);
          break;
        case 100:
          setAnimationData(englishAnimationData100);
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
