import { create } from "zustand";

interface UserInfoType {
  name: string;
  job: string;
  year: string;
  courseCategory: string;
  courseName: string;
  isLogin: boolean;

  setName: (name: string) => void;
  setJob: (job: string) => void;
  setYear: (year: string) => void;
  setCourseCategory: (category: string) => void;
  setCourseName: (name: string) => void;
  setIsLogin: (isLogin: boolean) => void;
}

export const useUserInfo = create<UserInfoType>()((set) => ({
  name: "",
  job: "",
  year: "",
  courseCategory: "",
  courseName: "",
  isLogin: false,

  setName: (name) => set({ name }),
  setJob: (job) => set({ job }),
  setYear: (year) => set({ year }),
  setCourseCategory: (category) => set({ courseCategory: category }),
  setCourseName: (name) => set({ courseName: name }),
  setIsLogin: (isLogin) => set({ isLogin }),
}));
