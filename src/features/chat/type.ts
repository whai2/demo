export type MessageType = {
  role: "user" | "assistant";
  content: string;
  isLoading: boolean;
};

export interface CourseRecommendation {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface CourseInfo {
  강의개요: string;
  가격: string;
  총강의시간: string;
  수강대상: string;
  "1차시": string;
  "2차시": string;
  "3차시": string;
  "4차시": string;
  "5차시": string;
}

export interface Course {
  [courseName: string]: CourseInfo;
}

export interface ChatState {
  messages: MessageType[];
  isLoading: boolean;
  recommendations: CourseRecommendation[];
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  setRecommendations: (recommendations: CourseRecommendation[]) => void;
}
