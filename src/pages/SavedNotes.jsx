"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { marked } from "marked"

const NoteCard = ({ note, index, onDelete }) => {
  const preview = note.content.slice(0, 200)
  const htmlPreview = marked(preview + (note.content.length > 200 ? "..." : ""))
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(note.savedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = new Date(note.savedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(index)
          }}
          className="p-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
          aria-label="Delete note"
        >
          <svg
            className="w-4 h-4"
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
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <svg
              className="w-4 h-4"
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
          </div>
          <div className="ml-2">
            <p className="text-xs text-muted-foreground">
              {formattedDate} at {formattedTime}
            </p>
          </div>
        </div>

        <div
          className="prose prose-invert max-w-none text-sm mb-4 line-clamp-4"
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            {note.content.length} characters
          </span>
          <Link
            to={`/note/${index}`}
            className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 transition-colors flex items-center"
          >
            <span>Read</span>
            <svg
              className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

const SavedNotes = () => {
  const [savedNotes, setSavedNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  const [sortBy, setSortBy] = useState("newest") // "newest", "oldest", "longest", "shortest"
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => {
      const notes = JSON.parse(localStorage.getItem("savedNotes") || "[]")
      setSavedNotes(notes)
      setIsLoading(false)
    }, 300)
  }, [])

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = [...savedNotes]
      updatedNotes.splice(index, 1)
      setSavedNotes(updatedNotes)
      localStorage.setItem("savedNotes", JSON.stringify(updatedNotes))
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const filteredNotes = savedNotes.filter((note) => note.content.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.savedAt) - new Date(a.savedAt)
      case "oldest":
        return new Date(a.savedAt) - new Date(b.savedAt)
      case "longest":
        return b.content.length - a.content.length
      case "shortest":
        return a.content.length - b.content.length
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Saved Notes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} found
              </p>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Back to Chat
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="longest">Longest First</option>
                <option value="shortest">Shortest First</option>
              </select>

              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label="Grid view"
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label="List view"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : savedNotes.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg shadow-md">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No saved notes yet</h3>
            <p className="text-muted-foreground mb-6">Start a conversation and save AI responses to see them here.</p>
            <Link
              to="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center"
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
              Start a New Chat
            </Link>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-muted-foreground">No notes match your search.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
            {sortedNotes.map((note, index) => (
              <NoteCard key={index} note={note} index={index} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedNotes

