"use client"

import { useEffect, useState } from "react"

const KeyboardShortcuts = ({ onNewChat, onClearChat, onFocusInput, onToggleSidebar }) => {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
        // Only handle Escape to blur from input
        if (e.key === "Escape") {
          e.target.blur()
        }
        return
      }

      // Global shortcuts
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowHelp(true)
      } else if (e.key === "Escape" && showHelp) {
        setShowHelp(false)
      } else if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onNewChat()
      } else if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onClearChat()
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        onFocusInput()
      } else if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onToggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showHelp, onNewChat, onClearChat, onFocusInput, onToggleSidebar])

  if (!showHelp) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={() => setShowHelp(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
          Keyboard Shortcuts
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">General</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span>Show keyboard shortcuts</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + ?</kbd>
              </li>
              <li className="flex justify-between text-sm">
                <span>Focus chat input</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">/</kbd>
              </li>
              <li className="flex justify-between text-sm">
                <span>Toggle sidebar</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + B</kbd>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Chat</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span>New chat</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + N</kbd>
              </li>
              <li className="flex justify-between text-sm">
                <span>Clear chat</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl + L</kbd>
              </li>
              <li className="flex justify-between text-sm">
                <span>Send message</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Enter</kbd>
              </li>
              <li className="flex justify-between text-sm">
                <span>New line in message</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Shift + Enter</kbd>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close this dialog
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcuts

