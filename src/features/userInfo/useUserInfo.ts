import { create } from "zustand";

interface UserInfoType {
  name: string;
  job: string;
  year: string;
  courseCategory: string;
  courseName: string;
  isLogin: boolean;
  courseAttendanceRate: number;
  currentLanguage: string;

  setName: (name: string) => void;
  setJob: (job: string) => void;
  setYear: (year: string) => void;
  setCourseCategory: (category: string) => void;
  setCourseName: (name: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setCourseAttendanceRate: (rate: number) => void;
  setCurrentLanguage: (language: string) => void;
  reset: () => void;
}

export const useUserInfo = create<UserInfoType>()((set) => ({
  name: "",
  job: "",
  year: "",
  courseCategory: "",
  courseName: "",
  isLogin: false,
  courseAttendanceRate: 0,
  currentLanguage: "",

  setName: (name) => set({ name }),
  setJob: (job) => set({ job }),
  setYear: (year) => set({ year }),
  setCourseCategory: (category) => set({ courseCategory: category }),
  setCourseName: (name) => set({ courseName: name }),
  setIsLogin: (isLogin) => set({ isLogin }),
  setCourseAttendanceRate: (rate) => set({ courseAttendanceRate: rate }),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  reset: () =>
    set({
      name: "",
      job: "",
      year: "",
      courseCategory: "",
      courseName: "",
      isLogin: false,
      courseAttendanceRate: 0,
      currentLanguage: "",
    }),
}));
