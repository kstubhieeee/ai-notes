"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../components/theme-provider"
import { useChat } from "../context/chat-context"
import { toast } from "../components/ui/toaster"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { clearHistory } = useChat()
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => {
      const storedApiKey = localStorage.getItem("api-key") || ""
      setApiKey(storedApiKey)
      setIsLoading(false)
    }, 300)
  }, [])

  const handleSaveApiKey = () => {
    localStorage.setItem("api-key", apiKey)
    toast.success({
      title: "API Key saved",
      description: "Your API key has been saved successfully.",
    })
  }

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history? This cannot be undone.")) {
      clearHistory()
    }
  }

  const handleClearNotes = () => {
    if (window.confirm("Are you sure you want to clear all saved notes? This cannot be undone.")) {
      localStorage.setItem("savedNotes", "[]")
      toast.success({
        title: "Notes cleared",
        description: "All saved notes have been removed.",
      })
    }
  }

  const handleExportData = () => {
    try {
      const chatHistory = localStorage.getItem("chat-history") || "[]"
      const savedNotes = localStorage.getItem("savedNotes") || "[]"

      const exportData = {
        chatHistory: JSON.parse(chatHistory),
        savedNotes: JSON.parse(savedNotes),
        exportDate: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `ainotes-export-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast.success({
        title: "Data exported",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast.error({
        title: "Export failed",
        description: "There was an error exporting your data.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-card p-6 rounded-lg border border-border mb-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-primary"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Configure your AI Notes application</p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Chat
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
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
                Appearance
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Theme</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        theme === "dark"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
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
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        theme === "light"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
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
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                API Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="api-key" className="text-sm font-medium block mb-2">
                    OpenRouter API Key
                  </label>
                  <div className="flex">
                    <input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-grow px-3 py-2 bg-muted border border-border rounded-l-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none"
                      placeholder="Enter your API key"
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-r-lg hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your API key is stored locally and never sent to our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-primary"
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
                Data Management
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center"
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
                    Clear Chat History
                  </button>
                  <button
                    onClick={handleClearNotes}
                    className="px-4 py-3 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center"
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
                    Clear Saved Notes
                  </button>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

