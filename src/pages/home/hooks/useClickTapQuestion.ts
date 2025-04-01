import { useSendChat } from "@/features/chat";
import { ROUTES, useNavigate } from "@/features/navigate";

export const useClickTapQuestion = () => {
  const { setCurrentPage } = useNavigate();
  const sendChatCallback = useSendChat();

  const handleClickTapQuestion = async (question: string) => {
    setCurrentPage(ROUTES.CHAT);
    await sendChatCallback(question);
  };

  return { handleClickTapQuestion };
};
