import { useEffect } from "react";

import { ChatPage } from "@/pages/chat";
import { HomePage } from "@/pages/home";
import { ChatPopUpLayout } from "@/pages/layout";

import { ROUTES, useNavigate } from "@/features/navigate";

const Router = () => {
  const { currentPage, setCurrentPage } = useNavigate();

  useEffect(() => {
    setCurrentPage(ROUTES.HOME);
  }, []);

  const renderContent = () => {
    if (ROUTES.CHAT === currentPage) {
      return <ChatPage />;
    }

    switch (currentPage) {
      case ROUTES.HOME:
        return <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return <ChatPopUpLayout>{renderContent()}</ChatPopUpLayout>;
};

export default Router;
