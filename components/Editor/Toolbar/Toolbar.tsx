import { EditorState } from 'draft-js';
import React, { FC } from 'react';
import Bold from '../Icons/Bold';
import Code from '../Icons/Code';
import Italic from '../Icons/Italic';
import Underline from '../Icons/Underline';
import ToolbarBtn from '../ToolbarBtn';

const toolbarItems = [
  { label: 'Bold', style: 'BOLD', icon: <Bold /> },
  { label: 'Italic', style: 'ITALIC', icon: <Italic /> },
  { label: 'Underline', style: 'UNDERLINE', icon: <Underline /> },
  { label: 'Code', style: 'CODE', icon: <Code /> },
];

interface ToolBarProps {
  editorState: EditorState;
  onToggle: (inlineStyle: string) => void;
}

const Toolbar: FC<ToolBarProps> = (props) => {
  const { editorState, onToggle } = props;
  let currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className='flex space-x-2'>
      {toolbarItems.map((toolbarItem) => (
        <ToolbarBtn
          key={toolbarItem.label}
          icon={toolbarItem.icon}
          label={toolbarItem.label}
          active={currentStyle.has(toolbarItem.style)}
          style={toolbarItem.style}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default Toolbar;
