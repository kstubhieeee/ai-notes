"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { toast } from "../components/ui/toaster"

const ChatContext = createContext({})

export const ChatProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [activeChat, setActiveChat] = useState({ id: null, messages: [], title: "New Chat" })

  // Load chat history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("chat-history")
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory)
        setChatHistory(parsedHistory)

        // Set the most recent chat as active if there is one
        if (parsedHistory.length > 0) {
          const mostRecent = parsedHistory.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0]
          setActiveChatId(mostRecent.id)
        }
      } catch (error) {
        console.error("Failed to parse chat history:", error)
      }
    }
  }, [])

  // Update active chat when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      const chat = chatHistory.find((chat) => chat.id === activeChatId)
      if (chat) {
        setActiveChat(chat)
      }
    } else {
      setActiveChat({ id: null, messages: [], title: "New Chat" })
    }
  }, [activeChatId, chatHistory])

  // Save chat history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(chatHistory))
  }, [chatHistory])

  const startNewChat = () => {
    const newChatId = uuidv4()
    const newChat = {
      id: newChatId,
      messages: [],
      title: "New Chat",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    setChatHistory((prev) => [newChat, ...prev])
    setActiveChatId(newChatId)

    return newChatId
  }

  const updateChat = (chatId, updates) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates, lastUpdated: new Date().toISOString() } : chat)),
    )
  }

  const addMessage = (chatId, message) => {
    // If no active chat, create a new one
    if (!chatId) {
      chatId = startNewChat()
    }

    setChatHistory((prev) => {
      const chatExists = prev.some((chat) => chat.id === chatId)

      if (!chatExists) {
        // This shouldn't happen, but just in case
        return prev
      }

      return prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, message]

          // Generate a title from the first user message if this is the first or second message
          let title = chat.title
          if (updatedMessages.length <= 2 && message.role === "user") {
            title = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
          }

          return {
            ...chat,
            messages: updatedMessages,
            title,
            lastUpdated: new Date().toISOString(),
          }
        }
        return chat
      })
    })

    return chatId
  }

  const clearChat = (chatId) => {
    if (!chatId) return

    updateChat(chatId, { messages: [] })
    toast.success({ title: "Chat cleared", description: "All messages have been removed from this chat." })
  }

  const deleteChat = (chatId) => {
    if (!chatId) return

    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId))

    // If we deleted the active chat, set the most recent as active or create a new one
    if (chatId === activeChatId) {
      const remaining = chatHistory.filter((chat) => chat.id !== chatId)
      if (remaining.length > 0) {
        const mostRecent = remaining.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0]
        setActiveChatId(mostRecent.id)
      } else {
        setActiveChatId(null)
      }
    }

    toast.success({ title: "Chat deleted", description: "The chat has been permanently removed." })
  }

  const clearHistory = () => {
    setChatHistory([])
    setActiveChatId(null)
    toast.success({ title: "History cleared", description: "All chat history has been removed." })
  }

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        activeChatId,
        activeChat,
        setActiveChatId,
        startNewChat,
        updateChat,
        addMessage,
        clearChat,
        deleteChat,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

