import React, { useState } from 'react';
import Draggable from 'react-draggable';
import useUndo from 'use-undo';
import './App.css';


const App = () => {
  const [textState, { set: setTexts, undo, redo, canUndo, canRedo }] = useUndo([]);
  const { present: texts } = textState;
  const [newText, setNewText] = useState('');
  const [selectedText, setSelectedText] = useState(null);
  const [color, setColor] = useState('#000000');
  const [fontStyle, setFontStyle] = useState('normal');
  const [fontSize, setFontSize] = useState('16px');

  const addText = () => {
    const newTextObj = {
      text: newText,
      id: Date.now(),
      color,
      fontStyle,
      fontSize,
      x: 0,
      y: 0
    };
    setTexts([...texts, newTextObj]);
    setNewText('');
  };

  const handleEdit = (id, newText) => {
    setTexts(
      texts.map((text) =>
        text.id === id ? { ...text, text: newText } : text
      )
    );
  };

  const handleDrag = (e, data, id) => {
    setTexts(
      texts.map((text) =>
        text.id === id
          ? { ...text, x: data.x, y: data.y }
          : text
      )
    );
  };

  const selectText = (id) => {
    const text = texts.find(text => text.id === id);
    setSelectedText(text);
    setColor(text.color);
    setFontStyle(text.fontStyle);
    setFontSize(text.fontSize);
  };

  const changeColor = (e) => {
    setColor(e.target.value);
    if (selectedText) {
      setTexts(
        texts.map((text) =>
          text.id === selectedText.id ? { ...text, color: e.target.value } : text
        )
      );
    }
  };

  const changeFontStyle = (e) => {
    setFontStyle(e.target.value);
    if (selectedText) {
      setTexts(
        texts.map((text) =>
          text.id === selectedText.id ? { ...text, fontStyle: e.target.value } : text
        )
      );
    }
  };

  const changeFontSize = (e) => {
    setFontSize(e.target.value + 'px');
    if (selectedText) {
      setTexts(
        texts.map((text) =>
          text.id === selectedText.id ? { ...text, fontSize: e.target.value + 'px' } : text
        )
      );
    }
  };

  return (
    <div className="App">
    
    
      <div className="controls">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter text"
        />
        <button onClick={addText}>Add Text</button>
        <input
          type="color"
          value={color}
          onChange={changeColor}
        />
        <select value={fontStyle} onChange={changeFontStyle}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
        </select>
        <input
          type="number"
          value={parseInt(fontSize)}
          onChange={changeFontSize}
          placeholder="Font Size"
        />
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
      <div className="text-area">
        {texts.map((text) => (
          <Draggable
            key={text.id}
            onDrag={(e, data) => handleDrag(e, data, text.id)}
            defaultPosition={{ x: text.x || 0, y: text.y || 0 }}
          >
            <div
              className="text-element"
              onClick={() => selectText(text.id)}
              style={{ color: text.color, fontStyle: text.fontStyle, fontSize: text.fontSize }}
            >
              <EditableText text={text.text} onEdit={(newText) => handleEdit(text.id, newText)} />
            </div>
          </Draggable>
        ))}
        
      </div>
    
    </div>
  );
};

const EditableText = ({ text, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleBlur = () => {
    setIsEditing(false);
    onEdit(editText);
  };

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default App;
