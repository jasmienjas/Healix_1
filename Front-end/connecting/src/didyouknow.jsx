import React, { useState } from 'react';
import styles from './AppOfMaria.module.css';  // Import the CSS module

const DidYouKnow = ({ facts }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const showPreviousFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex === 0 ? facts.length - 1 : prevIndex - 1));
  };

  const showNextFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex === facts.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles['did-you-know-container']}>
      <div className={styles['did-you-know-cards']}>
        <div className={styles['did-you-know-card']}>
          <h2>Did You Know?</h2>
          <p>{facts[currentFactIndex].fact}</p>
          <div className={styles['buttons-container']}>
            <button onClick={showPreviousFact} className={styles['prev-button']}>Previous</button>
            <button onClick={showNextFact} className={styles['next-button']}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DidYouKnow;
