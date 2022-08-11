import React, { FC, useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';

interface EditorProps {
  initialText: string;
  onSave: (data: string) => void;
}
const Editor: FC<EditorProps> = (props) => {
  const { initialText, onSave } = props;

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [showToolbar, setShowToolbar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [toolbarMeasures, setToolbarMeasures] = useState({ w: 0, h: 0 });
  const [toolbarCoordinates, setToolbarCoordinates] = useState({ x: 0, y: 0 });
  const [selectionMeasures, setSelectionMeasures] = useState({ w: 0, h: 0 });
  const [selectionCoordinates, setSelectionCoordinates] = useState({
    x: 0,
    y: 0,
  });

  useEffect(
    () =>
      setEditorState(
        initialText === ''
          ? EditorState.createEmpty()
          : EditorState.createWithContent(
              convertFromRaw(JSON.parse(initialText))
            )
      ),
    [initialText]
  );

  const editorRef = useRef<DraftEditor | null>(null);

  const elemWidth = useRef<number>(0);
  const elemHeight = useRef<number>(0);

  const editorFocus = () => editorRef.current && editorRef.current.focus();
  const onEditorChange = (es: EditorState) => setEditorState(es);

  const onClickEditor = () => {
    editorFocus();
    checkSelectedText();
  };

  // 1- Check if some text is selected
  const checkSelectedText = () => {
    if (typeof window !== 'undefined') {
      const selection = window.getSelection();
      if (!selection) return;

      const text = selection.toString();
      if (text !== '') {
        // 1-a Define the selection coordinates
        setSelectionXY();
      } else {
        // Hide the toolbar if nothing is selected
        setShowToolbar(false);
      }
    }
  };

  // 2- Identify the selection coordinates
  const setSelectionXY = () => {
    const selection = window.getSelection();
    if (!selection) return;
    var r = selection.getRangeAt(0).getBoundingClientRect();
    const node = document.body.parentElement;
    if (!(node instanceof Element)) return;
    var relative = node.getBoundingClientRect();
    // 2-a Set the selection coordinates in the state

    setSelectionCoordinates(r);
    setWindowWidth(relative.width);
    setSelectionMeasures({ w: r.width, h: r.height });
    showToolbarFun();
  };

  // 3- Show the toolbar
  const showToolbarFun = () => {
    setShowToolbar(true);
    measureToolbar();
  };

  // 4- The toolbar was hidden until now
  const measureToolbar = () => {
    // 4-a Define the toolbar width and height, as it is now visible

    setToolbarMeasures({ w: elemWidth.current, h: elemHeight.current });
    setToolbarXY();
  };

  // 5- Now that we have all measures, define toolbar coordinates
  const setToolbarXY = () => {
    let coordinates = { x: 0, y: 0 };

    const hiddenTop = selectionCoordinates.y < toolbarMeasures.h;
    const hiddenRight =
      windowWidth - selectionCoordinates.x < toolbarMeasures.w / 2;
    const hiddenLeft = selectionCoordinates.x < toolbarMeasures.w / 2;

    const normalX =
      selectionCoordinates.x - toolbarMeasures.w / 2 + selectionMeasures.w / 2;
    const normalY = selectionCoordinates.y - toolbarMeasures.h;

    const invertedY = selectionCoordinates.y + selectionMeasures.h;
    const moveXToLeft = windowWidth - toolbarMeasures.w;
    const moveXToRight = 0;

    coordinates = {
      x: normalX,
      y: normalY,
    };

    if (hiddenTop) {
      coordinates.y = invertedY;
    }

    if (hiddenRight) {
      coordinates.x = moveXToLeft;
    }

    if (hiddenLeft) {
      coordinates.x = moveXToRight;
    }

    setToolbarCoordinates(coordinates);
  };

  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleToolbar = (inlineStyle: string) =>
    onEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('resize', checkSelectedText);
    }
    return () => document.removeEventListener('resize', checkSelectedText);
  }, [checkSelectedText]);

  //convert to json before save the editor content
  const handleOnSave = () => {
    onSave(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div>
      <div
        ref={(elem) => {
          elemWidth.current = elem ? elem.clientWidth : 0;
          elemHeight.current = elem ? elem.clientHeight : 0;
        }}
        className={`${
          showToolbar ? 'block' : 'hidden'
        } rounded bg-black text-white z-50 p-0.5 absolute 
        left-[${toolbarCoordinates.x}px]
        top-[${toolbarCoordinates.y}px]
        `}>
        <Toolbar editorState={editorState} onToggle={toggleToolbar} />
      </div>
      <div onClick={onClickEditor} onBlur={checkSelectedText}>
        <DraftEditor
          onBlur={handleOnSave}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={(command, _, __) => handleKeyCommand(command)}
          onChange={onEditorChange}
          placeholder='Tell the story of this collection...'
          editorKey='collection'
          spellCheck={false}
          ref={(element) => {
            editorRef.current = element;
          }}
        />
      </div>
    </div>
  );
};

export default Editor;

// Custom overrides for each style
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 4,
  },
  BOLD: {
    fontWeight: 'bold',
  },
};
