import React, { createContext, useContext, useState } from 'react';
import LoginPromptModal from '@/components/LoginPromptModal'; 

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      {/* Global Modal Instance */}
      <LoginPromptModal open={isLoginOpen} onClose={closeLoginModal} />
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    // Guard against using hook outside provider
    return { openLoginModal: () => console.warn("LoginModalProvider missing"), closeLoginModal: () => {} };
  }
  return context;
};