import React, { FC } from 'react';
import { ActionIcon } from '@frontstate-ui';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import useDarkMode from '../hooks/useDarkMode';


const ThemeBtn: FC = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <ActionIcon onClick={handleMode}>
      {darkTheme ? (
        <SunIcon className='icon-sm' />
      ) : (
        <MoonIcon className='icon-sm' />
      )}
    </ActionIcon>
  );
};
export default ThemeBtn;
