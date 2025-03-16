"use client"

import { useState, useRef } from "react"
import type { FC } from "react"

const EmergencyButton: FC = () => {
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start tracking the button hold
  const startHold = () => {
    const startTime = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percentage = (elapsed / 3000) * 100 // 3000 ms = 3 seconds
      if (percentage >= 100) {
        if (timerRef.current) clearInterval(timerRef.current)
        // Instead of redirecting, we'll show an alert in this demo
        alert("Emergency services contacted! Help is on the way.")
        setProgress(0)
      } else {
        setProgress(percentage)
      }
    }, 50)
  }

  // Cancel the button hold
  const cancelHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      setProgress(0)
    }
  }

  return <div className="emergency-button-container">{/* Emergency button removed */}</div>
}

export default EmergencyButton

