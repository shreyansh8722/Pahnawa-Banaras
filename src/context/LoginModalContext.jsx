import React, { createContext, useContext, useState } from 'react';
import { LoginPromptModal } from '@/components/LoginPromptModal'; // CHANGED: Added { } for named import

const LoginModalContext = createContext();

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      <LoginPromptModal open={isOpen} onClose={closeLoginModal} />
    </LoginModalContext.Provider>
  );
}