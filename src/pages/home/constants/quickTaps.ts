import { ReactComponent as Document } from "../assets/document.svg";

export type QuickTapsType = {
  title: string;
  items: QuickTapItemType[];
};

export type QuickTapsType2 = {
  title: string;
  items: QuickTapItemType[];
  handleClickTapQuestion: (text: string) => void;
};

type QuickTapItemType = {
  icon: React.ComponentType;
  text: string;
};

export const oftenQuestionsTaps = {
  title: "콘텐츠 맞춤형 도움 제공",
  items: [
    {
      icon: Document,
      text: "좀 더 쉽게 이해될 수 있도록 설명해 주세요",
    },
    {
      icon: Document,
      text: "지금 보고 있는 부분 잘 모르겠어요.",
    },
    {
      icon: Document,
      text: "강의 내용을 요약해주세요.",
    },
    {
      icon: Document,
      text: "강의 핵심 키워드와 설명을 표로 제공해 주세요",
    },
  ],
};

export const othersQuestionsTaps = {
  title: "학습 현황 평가",
  items: [
    {
      icon: Document,
      text: "복습할 수 있는 방법 있나요?",
    },
    {
      icon: Document,
      text: "강의 제대로 이해했는지 확인해볼 수 있을까요?",
    },
  ],
};

export const courseLoadMaps = {
  title: "강의 로드맵",
  items: [
    {
      icon: Document,
      text: "지금 보는 강의랑 비슷한 강의를 찾아주세요",
    },
    {
      icon: Document,
      text: "이 강의 너무 어려워서 못 듣겠어요",
    },
  ],
};
