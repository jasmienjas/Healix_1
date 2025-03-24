"use client"

import { useState, useEffect } from "react"
import type { FC } from "react"

interface DynamicCounterProps {
  inView?: boolean
}

const DynamicCounter: FC<DynamicCounterProps> = ({ inView = false }) => {
  const [count, setCount] = useState(0)

  // Increment counter when in view
  useEffect(() => {
    if (inView === true) {
      // Explicitly check for true
      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < 100) {
            return prevCount + 1
          }
          clearInterval(timer)
          return prevCount
        })
      }, 50) // Increment every 50ms

      return () => {
        clearInterval(timer)
      }
    }
  }, [inView])

  return (
    <div className={`counter-container ${inView ? "in-view" : ""}`} id="counter">
      {/* Counters */}
      <div className="counter">
        <span className="counter-value">{count}</span>
        <p>Competent doctors</p>
      </div>

      <div className="counter">
        <span className="counter-value">{count * 2}</span>
        <p>Satisfied patients</p>
      </div>

      <div className="counter">
        <span className="counter-value">{count * 3}</span>
        <p>Successful treatments</p>
      </div>

      <div className="counter">
        <span className="counter-value">{count * 4}</span>
        <p>Happy families</p>
      </div>

      <div className="counter">
        <span className="counter-value">{count * 5}</span>
        <p>Positive reviews</p>
      </div>
    </div>
  )
}

export default DynamicCounter

