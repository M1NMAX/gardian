import React, { Component, FC } from 'react';

interface ToolbarBtnProps {
  onToggle: (inlineStyle: string) => void;
  style: string;
  label: string;
  active: boolean;
}

const ToolbarBtn: FC<ToolbarBtnProps> = (props) => {
  const { label, style, onToggle } = props;

  return (
    <span
      onMouseDown={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
      className='p-2.5'>
      {label}
    </span>
  );
};

export default ToolbarBtn;
