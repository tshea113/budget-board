import { createContext, useState } from 'react';

export const ModalContext = createContext({});

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps): React.ReactNode => {
  const [open, setOpen] = useState<boolean>(true);

  const modalValue = {
    open,
    setOpen,
  };

  return <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>;
};

export default ModalProvider;
