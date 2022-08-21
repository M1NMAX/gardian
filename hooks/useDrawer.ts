import { useState } from 'react';

const useDrawer = (onClose?: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return { isOpen, openDrawer, closeDrawer };
};

export default useDrawer;
