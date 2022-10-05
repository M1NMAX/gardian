import { CustomFlowbiteTheme } from 'flowbite-react';


export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    base: 'flex items-center justify-center p-0.5 rounded font-semibold',
    disabled: 'cursor-no-drop opacity-50',
    color: {
      success:
        'bg-primary-200  hover:bg-primary-300  disabled:hover:bg-primary-200',
      gray: 'hover:bg-gray-200 dark:bg-gray-700',
    },
    size: {
      md: 'p-0.5',
    },
  },
  darkThemeToggle: {
    base: 'flex justify-center items-center rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700',
    icon: 'icon-sm',
  },
  tooltip: {
    animation: 'transition-opacity duration-500',
  },
};
