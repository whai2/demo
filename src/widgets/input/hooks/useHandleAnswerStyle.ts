import { useEffect, useState } from "react";

import { useChatStore } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";

import answerStyleListKorean, { answerStyleListEnglish } from "../constant/constant";

export const useHandleAnswerStyle = () => {
  const { setAnswerStyle } = useChatStore();
  const [isFirst, setIsFirst] = useState(true);
  const [isAnswerStylesOpen, setIsAnswerStylesOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const { currentLanguage } = useUserInfo();
  const [answerStyleTitle, setAnswerStyleTitle] = useState(
    currentLanguage === "한국어" ? "답변스타일" : "Answer Style"
  );
  const [answerStyleRequestParams, setAnswerStyleRequestParams] = useState("");

  const answerStyleList =
    currentLanguage === "한국어" ? answerStyleListKorean : answerStyleListEnglish;

  const handleAnswerStyleToggle = () => {
    if (isFirst) {
      setIsFirst(false);
    }

    setIsAnswerStylesOpen((prev) => !prev);
  };

  const handleAnswerStyleClose = () => {
    setIsAnswerStylesOpen(false);
  };

  const handleSelectAnswerStyle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedOption(Number(event.target.value));
  };

  useEffect(() => {
    if (!isFirst) {
      setAnswerStyleTitle(
        answerStyleList.find((item) => item.id === selectedOption)?.title ||
          (currentLanguage === "한국어" ? "답변스타일" : "Answer Style")
      );
    }
  }, [selectedOption, isFirst]);

  useEffect(() => {
    setAnswerStyleRequestParams(
      answerStyleList.find((item) => item.id === selectedOption)
        ?.requestParams || ""
    );
    setAnswerStyle(
      answerStyleList.find((item) => item.id === selectedOption)
        ?.requestParams || ""
    );
  }, [selectedOption]);

  return {
    answerStyleTitle,
    isAnswerStylesOpen,
    selectedOption,
    answerStyleRequestParams,
    handleAnswerStyleToggle,
    handleAnswerStyleClose,
    handleSelectAnswerStyle,
  };
};
