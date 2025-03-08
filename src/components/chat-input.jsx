"use client"

import { useState, useRef, useEffect, forwardRef } from "react"

const ChatInput = forwardRef(({ onSendMessage, isLoading }, ref) => {
  const [input, setInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(textareaRef.current)
      } else {
        ref.current = textareaRef.current
      }
    }
    textareaRef.current?.focus()
  }, [ref])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !isComposing) {
      onSendMessage(input)
      setInput("")
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "50px"
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      handleSubmit(e)
    }
  }

  // Handle IME composition (for languages like Chinese, Japanese, Korean)
  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  // Auto-resize textarea as content grows
  const handleInput = (e) => {
    const target = e.target
    setInput(target.value)

    // Reset height to auto to get the correct scrollHeight
    target.style.height = "auto"

    // Set the height to scrollHeight + border
    const newHeight = Math.min(target.scrollHeight, 150)
    target.style.height = `${newHeight}px`
  }

  return (
    <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center bg-muted rounded-xl overflow-hidden shadow-sm border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Type a message..."
            className="flex-grow py-3 px-4 bg-transparent outline-none resize-none min-h-[50px] max-h-[150px] text-foreground placeholder-muted-foreground"
            style={{ height: "50px" }}
            disabled={isLoading}
          />
          <div className="flex items-center pr-2">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors"
              aria-label="Keyboard shortcuts"
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?", ctrlKey: true }))}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 ml-1 rounded-full ${
                !input.trim() || isLoading
                  ? "bg-secondary text-secondary-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } transition-colors duration-200 flex items-center justify-center`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </form>
    </div>
  )
})

ChatInput.displayName = "ChatInput"

export default ChatInput

