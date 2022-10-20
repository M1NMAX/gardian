import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { SCREEN_SIZE_MD } from '@constants';
import useWindowDimensions from '@hooks/useWindowDimensions';


interface SidebarContextProps {
  isOpenOnSmallScreens: boolean;
  isPageWithSidebar: boolean;
  setOpenOnSmallScreens: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(undefined!);

export function SidebarProvider({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  const [isOpen, setOpen] = useState(false);

  const { width } = useWindowDimensions();

  useEffect(() => {
    setOpen(width >= SCREEN_SIZE_MD);
  }, [width]);

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

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      'useSidebarContext should be used within the SidebarContext provider!'
    );
  }
  return context;
}
