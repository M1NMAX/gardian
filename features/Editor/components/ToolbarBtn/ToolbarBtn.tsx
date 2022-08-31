import React, { FC, ReactNode } from 'react';

interface ToolbarBtnProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  style: string;
  onToggle: (inlineStyle: string) => void;
}

const ToolbarBtn: FC<ToolbarBtnProps> = (props) => {
  const { icon, label, active, style, onToggle } = props;

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
      className={`${active && 'border-b-2 border-primary-200'} p-0.5`}>
      {icon}
      <span className='sr-only'>{label}</span>
    </button>
  );
};

export default ToolbarBtn;
