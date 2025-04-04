const alarmMessages = {
  default: [
    {
      message: "강의에서 궁금한 점을\n무엇이든 물어보세요!",
    },
    { message: "AI 캐미에요.\n무엇을 도와드릴까요?" },
    { message: `' / ' (슬래시) 키를 누르면, \n바로 질문할 수 있어요!` },
  ],
  callToAction: [
    {
      message: "이번 강의는 잘 이해하셨는지 확인해 볼까요??",
      question: "이번 강의 차시의 퀴즈를 제공해 주세요.",
    },
    {
      message: "맞춤 복습 퀴즈 준비했어요!\n지금까지 배운 내용 복습하고 갈까요?",
      question: "배운 내용을 복습하고 싶어요.",
    },
  ],
};

export default alarmMessages;
