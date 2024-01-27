import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalContext = createContext({});

const ModalProvider = ({ children }: { children: any }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(true);

  const modalValue = {
    open,
    setOpen,
  };

  return <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>;
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalProvider;
