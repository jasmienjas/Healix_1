"use client"

import type { FC } from "react"

interface AlphabetChallengeProps {
  alphabet: string[]
  handleLetterClick: (letter: string) => void
}

const AlphabetChallenge: FC<AlphabetChallengeProps> = ({ alphabet, handleLetterClick }) => {
  return (
    <div className="alphabet-container">
      <h2 className="alphabet-title">Unlock the Alphabet Challenge!</h2>
      <div className="alphabet-buttons">
        {alphabet.map((letter) => (
          <button
            key={letter}
            className="alphabet-button"
            onClick={() => handleLetterClick(letter)}
            aria-label={`Filter by ${letter}`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AlphabetChallenge

