import React, { FC } from 'react';
import useDarkMode from '../hooks/useDarkMode';
import { MoonIcon } from '@heroicons/react/solid';
import { SunIcon } from '@heroicons/react/outline';
import { ActionIcon } from '../../../components/frontstate-ui';

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
