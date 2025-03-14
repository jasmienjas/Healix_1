import React from 'react';
import styles from './AppOfMaria.module.css';  // Import the CSS module

const AlphabetChallenge = ({ alphabet, handleLetterClick }) => {
  return (
    <div className={styles['alphabet-container']}>
      <h2 className={styles['alphabet-title']}>Unlock the Alphabet Challenge!</h2>
      <div className={styles['alphabet-buttons']}>
        {alphabet.map((letter) => (
          <button
            key={letter}
            className={styles['alphabet-button']}  // Use the CSS module class
            onClick={() => handleLetterClick(letter)}
            aria-label={`Filter by ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlphabetChallenge;
