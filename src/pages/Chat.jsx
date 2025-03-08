"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "../context/chat-context"
import { toast } from "../components/ui/toaster"
import ChatHeader from "../components/chat-header"
import ChatSidebar from "../components/chat-sidebar"
import MessageBubble from "../components/message-bubble"
import ThinkingAnimation from "../components/thinking-animation"
import ChatInput from "../components/chat-input"
import KeyboardShortcuts from "../components/keyboard-shortcuts"

const Chat = () => {
  const { activeChat, activeChatId, addMessage, clearChat, startNewChat } = useChat()
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesContainerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const API_KEY = import.meta.env.VITE_V1_API

  // Example suggested prompts
  const suggestedPrompts = [
    "Explain how React hooks work",
    "Write a function to reverse a string in JavaScript",
    "What are the best practices for API design?",
    "Help me debug my async/await code",
  ]

  useEffect(() => {
    scrollToBottom()

    // Add scroll event listener to show/hide scroll button
    const container = messagesContainerRef.current
    if (container) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
        setShowScrollButton(!isNearBottom && activeChat.messages.length > 3)
      }

      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [activeChat.messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatCodeResponse = (text) => {
    return text
      .replace(/\[object Object\],\n?/g, "")
      .replace(/,$$,\[object Object\],$$/g, "")
      .replace(/,\[object Object\],/g, "")
      .trim()
  }

  const saveToNotes = (message) => {
    const savedNotes = JSON.parse(localStorage.getItem("savedNotes") || "[]")
    savedNotes.push({
      ...message,
      savedAt: new Date().toISOString(),
    })
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes))
    toast.success({
      title: "Note saved",
      description: "The message has been saved to your notes.",
    })
  }

  const sendMessage = async (inputText) => {
    if (!inputText.trim()) return

    const userMessage = {
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString(),
    }

    // Add user message to chat
    addMessage(activeChatId, userMessage)
    setIsLoading(true)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: activeChat.messages.concat(userMessage).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const botReply = data.choices[0]?.message

      if (botReply) {
        const formattedContent = formatCodeResponse(botReply.content)
        const assistantMessage = {
          role: botReply.role,
          content: formattedContent,
          timestamp: new Date().toISOString(),
        }

        // Add assistant message to chat
        addMessage(activeChatId, assistantMessage)
      }
    } catch (error) {
      console.error("Error fetching response:", error)

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      }

      // Add error message to chat
      addMessage(activeChatId, errorMessage)

      toast.error({
        title: "Error",
        description: "Failed to get a response. Please check your connection and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt) => {
    sendMessage(prompt)
  }

  const handleClearChat = () => {
    if (activeChatId && activeChat.messages.length > 0) {
      if (window.confirm("Are you sure you want to clear this chat?")) {
        clearChat(activeChatId)
      }
    }
  }

  const handleNewChat = () => {
    startNewChat()
    setSidebarOpen(false)
  }

  const handleFocusInput = () => {
    inputRef.current?.focus()
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-72 h-full">
        <ChatSidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 h-full">
            <ChatSidebar isMobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full">
        <ChatHeader onMenuClick={toggleSidebar} />

        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 relative scroll-smooth">
          {activeChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-20 h-20 mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
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
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to AI Notes</h3>
              <p className="text-center text-muted-foreground mb-8 max-w-md">
                Ask me anything about programming, technology, or any topic you'd like to explore.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left p-3 bg-secondary/50 hover:bg-secondary border border-border rounded-lg text-sm transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center text-xs text-muted-foreground">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-1">?</kbd> for keyboard shortcuts
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6 pb-2">
                {activeChat.messages.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    message={msg}
                    isLast={index === activeChat.messages.length - 1}
                    onSave={() => saveToNotes(msg)}
                    showSaveButton={msg.role === "assistant"}
                  />
                ))}
                {isLoading && <ThinkingAnimation />}
              </div>
              <div ref={messagesEndRef} />
            </>
          )}

          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all animate-bounce-slow"
              aria-label="Scroll to bottom"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
        </div>

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} ref={inputRef} />
      </div>

      <KeyboardShortcuts
        onNewChat={handleNewChat}
        onClearChat={handleClearChat}
        onFocusInput={handleFocusInput}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  )
}

export default Chat

