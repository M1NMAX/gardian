import { EditorState } from 'draft-js';
import React, { FC } from 'react';
import ToolbarBtn from '../ToolbarBtn';

const toolbarItems = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Code', style: 'CODE' },
  { label: 'Surprise', style: 'STRIKETHROUGH' },
];

interface ToolBarProps {
  editorState: EditorState;
  onToggle: (inlineStyle: string) => void;
}

const Toolbar: FC<ToolBarProps> = (props) => {
  const { editorState, onToggle } = props;
  let currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div>
      {toolbarItems.map((toolbarItem) => (
        <ToolbarBtn
          key={toolbarItem.label}
          active={currentStyle.has(toolbarItem.style)}
          label={toolbarItem.label}
          style={toolbarItem.style}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default Toolbar;
