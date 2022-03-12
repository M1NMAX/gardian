import React, {FC} from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import { MoonIcon } from '@heroicons/react/solid';
import { SunIcon } from '@heroicons/react/outline';

const ThemeBtn: FC = () => {
    const [darkTheme, setDarkTheme] = useDarkMode();
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
        <button onClick={handleMode}
            className='flex justify-center items-center  dark:text-white
            rounded-md  hover:bg-green-400  dark:hover:bg-green-400' >
            {darkTheme ? (
                <SunIcon className='icon-lg icon-animation' />
            ) : (
                <MoonIcon className='icon-lg icon-animation' />
            )}
        </button>
    );
};
export default ThemeBtn;