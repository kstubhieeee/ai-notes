"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import MessageBubble from "../components/message-bubble"

const NoteDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading for better UX
    setTimeout(() => {
      const allNotes = JSON.parse(localStorage.getItem("savedNotes") || "[]")
      setSavedNotes(allNotes)
      const selectedNote = allNotes[Number.parseInt(id)]
      if (selectedNote) {
        setNote(selectedNote)
      }
      setIsLoading(false)
    }, 300)
  }, [id])

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = [...savedNotes]
      updatedNotes.splice(Number.parseInt(id), 1)
      localStorage.setItem("savedNotes", JSON.stringify(updatedNotes))
      navigate("/saved-notes")
    }
  }

  const handleCopy = async () => {
    if (!note) return

    try {
      await navigator.clipboard.writeText(note.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const navigateToNote = (newId) => {
    navigate(`/note/${newId}`)
  }

  const currentIndex = Number.parseInt(id)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < savedNotes.length - 1

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-card border border-border rounded-lg shadow-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Note not found</h2>
          <p className="text-muted-foreground mb-6">
            The note you're looking for may have been deleted or doesn't exist.
          </p>
          <Link
            to="/saved-notes"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center"
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
            Back to Saved Notes
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(note.savedAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = new Date(note.savedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Note Details
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Saved on {formattedDate} at {formattedTime}
              </p>
            </div>
            <Link
              to="/saved-notes"
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
              Back to Notes
            </Link>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center text-sm"
            >
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
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              {copied ? "Copied!" : "Copy Content"}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center text-sm"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Note
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => hasPrevious && navigateToNote(currentIndex - 1)}
              disabled={!hasPrevious}
              className={`p-2 rounded-lg border ${
                hasPrevious
                  ? "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "border-border/50 bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed"
              } transition-colors`}
              aria-label="Previous note"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => hasNext && navigateToNote(currentIndex + 1)}
              disabled={!hasNext}
              className={`p-2 rounded-lg border ${
                hasNext
                  ? "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "border-border/50 bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed"
              } transition-colors`}
              aria-label="Next note"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md">
          <div className="p-1">
            <MessageBubble message={note} />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            <span className="flex items-center">
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              {note.content.length} characters
            </span>
          </div>

          <div className="flex space-x-4">
            {hasPrevious && (
              <button
                onClick={() => navigateToNote(currentIndex - 1)}
                className="text-sm text-primary flex items-center hover:underline"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous Note
              </button>
            )}

            {hasNext && (
              <button
                onClick={() => navigateToNote(currentIndex + 1)}
                className="text-sm text-primary flex items-center hover:underline"
              >
                Next Note
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteDetail

