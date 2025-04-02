export type MessageType = {
  role: "user" | "assistant";
  content: string;
  isLoading: boolean;
  reference?: {
    isLoading: boolean;
    reference: any;
  };
  isCourseRecommendation?: boolean;
  recommendationCourses?: {
    isLoading?: boolean;
    courses?: RecommendationCourse[];
    contents?: {
      content: string;
    }[];
  };
  courseQuiz?: {
    isLoading: boolean;
    quiz: Quiz;
  };
};

export interface Quiz {
  question: string;
  choices: string[];
  answerIndex: number;
}

export interface RecommendationCourse {
  name: string;
  price: string;
  duration: string;
  target: string;
}

export interface CourseRecommendation {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface CourseInfo {
  name: string;
  price: string;
  duration: string;
  target: string;
  description: string;
  content: {
    [key: string]: string;
  }[];
}

export interface CourseCategory {
  name: string;
  courses: CourseInfo[];
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
