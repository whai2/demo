import { useEffect, useState } from "react";

import { useChatStore } from "@/features/chat";
import answerStyleList from "../constant/constant";

export const useHandleAnswerStyle = () => {
  const { setAnswerStyle, answerStyle } = useChatStore();
  const [isFirst, setIsFirst] = useState(true);
  const [isAnswerStylesOpen, setIsAnswerStylesOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);
  const [answerStyleTitle, setAnswerStyleTitle] = useState("답변스타일");
  const [answerStyleRequestParams, setAnswerStyleRequestParams] = useState("");

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
          "답변스타일"
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
