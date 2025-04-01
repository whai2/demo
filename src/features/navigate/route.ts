const ROUTES = {
  HOME: "/",
  HISTORY: "/history",
  CHAT: "/chat",
  DYNAMIC_CHAT: (sessionId: string, isFrontGenerate?: boolean) =>
    `/chat?sessionId=${sessionId}&isFrontGenerate=${isFrontGenerate}`,
};

export default ROUTES;
