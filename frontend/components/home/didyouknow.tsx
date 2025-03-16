"use client"

import { useState } from "react"
import type { FC } from "react"

interface Fact {
  id: number
  fact: string
}

interface DidYouKnowProps {
  facts: Fact[]
}

const DidYouKnow: FC<DidYouKnowProps> = ({ facts }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const showPreviousFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex === 0 ? facts.length - 1 : prevIndex - 1))
  }

  const showNextFact = () => {
    setCurrentFactIndex((prevIndex) => (prevIndex === facts.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div
      className="did-you-know-container"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        position: "relative",
      }}
    >
      <div className="did-you-know-content">
        <h2 className="text-3xl font-bold mb-4">Did You Know?</h2>
        <p className="text-xl mb-6">
          {facts && facts[currentFactIndex] ? facts[currentFactIndex].fact : "Loading facts..."}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={showPreviousFact}
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={showNextFact}
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default DidYouKnow

