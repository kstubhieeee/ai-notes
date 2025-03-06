"use client"

import { useEffect, useState } from "react"

const ThinkingAnimation = () => {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-tl-none">
          <p className="text-sm md:text-base flex items-center">
            <span className="mr-1">Thinking</span>
            <span className="w-8 text-left">{dots}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ThinkingAnimation

