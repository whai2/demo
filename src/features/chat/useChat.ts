import { create } from "zustand";

export type MessageType = {
  role: "user" | "assistant";
  content: string;
  isLoading: boolean;
};

interface ChatState {
  messages: MessageType[];
  isLoading: boolean;
  setMessages: (
    messages: MessageType[] | ((prev: MessageType[]) => MessageType[])
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export const useSendChat = (text: string, setText: (text: string) => void) => {
  const { setMessages, setIsLoading } = useChatStore();

  const sendChatCallback = async () => {
    const currentText = text;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentText, isLoading: false },
    ]);

    setText("");
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: currentText }],
            stream: true, // 🔥 스트리밍 활성화
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("네트워크 응답 실패");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].isLoading = false;
        return updatedMessages;
      });

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();

            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices[0].delta.content;

              if (delta) {
                assistantMessage += delta;

                // 실시간 메시지 상태 업데이트
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];
                  updatedMessages[updatedMessages.length - 1].content =
                    assistantMessage;
                  return updatedMessages;
                });
              }
            } catch (error) {
              console.error("JSON 파싱 에러", error);
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return sendChatCallback;
};
