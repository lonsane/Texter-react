import React from 'react';

const LetterPullup = ({ words, delay }) => {
  const letters = words.split('');
  const [letterState, setLetterState] = React.useState({
    letters: letters.map((letter, index) => ({ letter, x: 0, y: 0, delay: delay * index })),
  });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setLetterState((prevLetterState) => {
      return {
        letters: prevLetterState.letters.map((letter, index) => {
          return {
            ...letter,
            x: clientX + (Math.random() - 0.5) * 10,
            y: clientY + (Math.random() - 0.5) * 10,
          };
        }),
      };
    });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {letterState.letters.map((letter, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: letter.y,
            left: letter.x,
            transition: `all ${delay * index}ms`,
          }}
        >
          {letter.letter}
        </div>
      ))}
    </div>
  );
};

export default LetterPullup;