const alarmMessages = {
  default: [
    {
      message: "강의에서 궁금한 점은 무엇이든 물어보세요!",
    },
  ],
  pause: [
    {
      message: "지금까지 궁금한 부분이 있으신가요?",
    },
    {
      message:
        "잠시 쉬는 중이신가요?\n궁금한 점 있으시면 언제든지 도와드릴게요!",
    },
  ],
  mouse: [
    {
      message: "안녕하세요.\n무엇을 도와드릴까요?",
    },
  ],
  callToAction: [
    {
      message:
        "수강 완료가 다가오고 있어요.\n다음에는 어떤 것을 배우고 싶나요?",
      question: "앞으로의 학습 로드맵을 제공해 주세요.",
      isQuiz: false,
    },
    {
      message: "강의 완료를 앞두고, 어려운 부분이 있나요?",
      question: "앞으로의 학습 로드맵을 제공해 주세요.",
      isQuiz: false,
    },
  ],
  quiz: [
    {
      message: "이번 강의는 잘 이해하셨는지 확인해 볼까요??",
      question: "이번 강의 차시의 퀴즈를 제공해 주세요.",
      isQuiz: true,
    },
    {
      message:
        "맞춤 복습 퀴즈 준비했어요!\n지금까지 배운 내용 복습하고 갈까요?",
      question: "배운 내용을 복습하고 싶어요.",
      isQuiz: true,
    },
  ],
};

export const alarmMessagesEnglish = {
  default: [
    {
      message:
        "Feel free to ask me anything\nyou're curious about in the course!",
    },
  ],
  pause: [
    {
      message: "Do you have any questions so far?",
    },
    {
      message:
        "Feel free to ask me anything\nyou're curious about in the course!",
    },
  ],
  mouse: [
    {
      message: "Hello!\nIs there anything I can help you with?",
    },
  ],
  callToAction: [
    {
      message:
        "Completion of the course is coming up.\nWhat do you want to learn next?",
      question: "Please provide the learning roadmap for the future.",
      isQuiz: false,
    },
    {
      message:
        "Ahead of the completion of the lecture, \nare there any difficulties?",
      question: "Please provide the learning roadmap for the future.",
      isQuiz: false,
    },
  ],
  quiz: [
    {
      message: "Shall we check if you understand\nthis lecture well?",
      question: "Shall I provide the quiz for this lecture?",
      isQuiz: true,
    },
    {
      message: "I've prepared a custom review\nquiz for you!",
      question: "I want to review the content with a quiz.",
      isQuiz: true,
    },
  ],
};

export default alarmMessages;
