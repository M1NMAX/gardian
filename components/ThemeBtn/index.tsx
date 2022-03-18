import React, {FC} from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import { MoonIcon } from '@heroicons/react/solid';
import { SunIcon } from '@heroicons/react/outline';

const ThemeBtn: FC = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
        <button onClick={handleMode}
            className='btn btn-secondary' >
            {darkTheme ? (
                <SunIcon className='icon-md' />
            ) : (
                <MoonIcon className='icon-md' />
            )}
        </button>
    );
};
export default ThemeBtn;