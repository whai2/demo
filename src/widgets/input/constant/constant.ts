export interface AnswerStyleType {
  value: number;
  title: string;
  subTitle: string;
}

const answerStyleListKorean = [
  {
    id: 1,
    title: "핵심요약",
    subTitle: "요점만 짧고 간결하게",
    requestParams: "concise",
  },
  {
    id: 2,
    title: "초보자",
    subTitle: "비전문가도 이해할 수 있게",
    requestParams: "easy",
  },
  {
    id: 3,
    title: "전문가",
    subTitle: "전문적인 내용까지 자세하게",
    requestParams: "professional",
  },
];

export const answerStyleListEnglish = [
  {
    id: 1,
    title: "Core Summary",
    subTitle: "Summarize the core points concisely",
    requestParams: "concise",
  },
  {
    id: 2,
    title: "Beginner",
    subTitle: "Make it easy for non-experts to understand",
    requestParams: "easy",
  },
  {
    id: 3,
    title: "Professional",
    subTitle: "Explain the content in detail",
    requestParams: "professional",
  },
];

export default answerStyleListKorean;
