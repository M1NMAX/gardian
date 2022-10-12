import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { SCREEN_SIZE_MD } from '@constants';


interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const location = isBrowser() ? window.location : '/';
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isSmallScreen()) {
      setOpen(false);
    }
  }, [location]);

  return (
    <SidebarContext.Provider
      value={{
        isOpenOnSmallScreens: isOpen,
        isPageWithSidebar: true,
        setOpenOnSmallScreens: setOpen,
      }}>
      {children}
    </SidebarContext.Provider>
  );
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function isSmallScreen(): boolean {
  return isBrowser() && window.innerWidth < SCREEN_SIZE_MD;
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebarContext should be used within the SidebarContext provider!'
    );
  }
  return context;
}
