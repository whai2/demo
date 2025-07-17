import { create } from "zustand";
import { persist } from "zustand/middleware";

function convertHangulToKeyboard(input: string): string {
  const HANGUL_TO_ENG_KEYBOARD: Record<string, string> = {
    ㄱ: "r",
    ㄲ: "R",
    ㄴ: "s",
    ㄷ: "e",
    ㄸ: "E",
    ㄹ: "f",
    ㅁ: "a",
    ㅂ: "q",
    ㅃ: "Q",
    ㅅ: "t",
    ㅆ: "T",
    ㅇ: "d",
    ㅈ: "w",
    ㅉ: "W",
    ㅊ: "c",
    ㅋ: "z",
    ㅌ: "x",
    ㅍ: "v",
    ㅎ: "g",

    ㅏ: "k",
    ㅐ: "o",
    ㅑ: "i",
    ㅒ: "O",
    ㅓ: "j",
    ㅔ: "p",
    ㅕ: "u",
    ㅖ: "P",
    ㅗ: "h",
    ㅛ: "y",
    ㅜ: "n",
    ㅠ: "b",
    ㅡ: "m",
    ㅣ: "l",

    ㄳ: "rt",
    ㄵ: "sw",
    ㄶ: "sg",
    ㄺ: "fr",
    ㄻ: "fa",
    ㄼ: "fq",
    ㄽ: "ft",
    ㄾ: "fx",
    ㄿ: "fv",
    ㅀ: "fg",
    ㅄ: "qt",
  };

  const CHO = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const JUNG = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const JONG = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  let result = "";

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const code = ch.charCodeAt(0);

    if (code >= 0xac00 && code <= 0xd7a3) {
      // 완성형 한글
      const uni = code - 0xac00;
      const cho = CHO[Math.floor(uni / (21 * 28))];
      const jung = JUNG[Math.floor((uni % (21 * 28)) / 28)];
      const jong = JONG[uni % 28];

      result += HANGUL_TO_ENG_KEYBOARD[cho] || "";
      result += HANGUL_TO_ENG_KEYBOARD[jung] || "";
      if (jong) result += HANGUL_TO_ENG_KEYBOARD[jong] || "";
    } else if (HANGUL_TO_ENG_KEYBOARD[ch]) {
      // 자모 (ㄱ,ㅏ 등)
      result += HANGUL_TO_ENG_KEYBOARD[ch];
    } else if (/^[a-zA-Z0-9]$/.test(ch)) {
      // 영문자, 숫자
      result += ch;
    }
    // 특수문자는 무시
  }

  return result;
}

interface UserInfoType {
  name: string;
  userId: string;
  job: string;
  year: string;
  courseCategory: string;
  courseName: string;
  isLogin: boolean;
  courseAttendanceRate: number;
  currentLanguage: string;
  isPassPassword: boolean;

  setName: (name: string) => void;
  setJob: (job: string) => void;
  setYear: (year: string) => void;
  setCourseCategory: (category: string) => void;
  setCourseName: (name: string) => void;
  setIsLogin: (isLogin: boolean) => void;
  setCourseAttendanceRate: (rate: number) => void;
  setCurrentLanguage: (language: string) => void;
  setIsPassPassword: (isPassPassword: boolean) => void;
  reset: () => void;
}

export const useUserInfo = create<UserInfoType>()(
  persist(
    (set) => ({
      name: "",
      userId: "",
      job: "",
      year: "",
      courseCategory: "",
      courseName: "",
      isLogin: false,
      courseAttendanceRate: 0,
      currentLanguage: "",
      isPassPassword: false,

      setName: (name) =>
        set((state) => ({
          name,
          userId: convertHangulToKeyboard(name),
        })),
      setJob: (job) => set({ job }),
      setYear: (year) => set({ year }),
      setCourseCategory: (category) => set({ courseCategory: category }),
      setCourseName: (name) => set({ courseName: name }),
      setIsLogin: (isLogin) => set({ isLogin }),
      setCourseAttendanceRate: (rate) => set({ courseAttendanceRate: rate }),
      setCurrentLanguage: (language) => set({ currentLanguage: language }),
      setIsPassPassword: (isPassPassword) => set({ isPassPassword }),
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
          isPassPassword: false,
        }),
    }),
    {
      name: "user-info-2",
    }
  )
);
