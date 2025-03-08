"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "./theme-provider"
import { useChat } from "../context/chat-context"
import { formatDistanceToNow } from "../utils/date-utils"

const ChatSidebar = ({ isMobile, onClose }) => {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { chatHistory, clearHistory, startNewChat, activeChatId, setActiveChatId } = useChat()
  const [savedNotes, setSavedNotes] = useState([])

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem("savedNotes") || "[]")
    setSavedNotes(notes)
  }, [location.pathname])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearHistory()
    }
  }

  const handleNewChat = () => {
    startNewChat()
    if (isMobile) onClose()
  }

  const handleChatSelect = (id) => {
    setActiveChatId(id)
    if (isMobile) onClose()
  }

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <button
          onClick={handleNewChat}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Recent Chats
          </h3>
          {chatHistory.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">No chat history yet</div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center ${
                    activeChatId === chat.id ? "bg-primary/10 text-primary" : "hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-2 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <div className="truncate flex-1">{chat.title || "New Conversation"}</div>
                  <div className="text-xs text-muted-foreground ml-2">{formatDistanceToNow(chat.lastUpdated)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Saved Notes
          </h3>
          {savedNotes.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">No saved notes yet</div>
          ) : (
            <div className="space-y-2">
              {savedNotes.slice(0, 5).map((note, index) => (
                <Link
                  key={index}
                  to={`/note/${index}`}
                  onClick={isMobile ? onClose : undefined}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 shrink-0 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="truncate">{note.content.slice(0, 30)}...</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-6">{formatDistanceToNow(note.savedAt)}</div>
                </Link>
              ))}
              {savedNotes.length > 5 && (
                <Link
                  to="/saved-notes"
                  onClick={isMobile ? onClose : undefined}
                  className="block text-center text-xs text-primary hover:underline mt-2"
                >
                  View all {savedNotes.length} notes
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/saved-notes"
          onClick={isMobile ? onClose : undefined}
          className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors w-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          All Saved Notes
        </Link>
        <Link
          to="/settings"
          onClick={isMobile ? onClose : undefined}
          className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors w-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
        <button
          onClick={toggleTheme}
          className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors w-full"
        >
          {theme === "dark" ? (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={handleClearHistory}
          className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors w-full"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear History
        </button>
      </div>
    </div>
  )
}

export default ChatSidebar

