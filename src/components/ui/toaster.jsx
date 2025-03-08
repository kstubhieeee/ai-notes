"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

export const Toaster = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return createPortal(
    <div className="fixed top-0 right-0 z-[100] flex flex-col gap-2 w-full max-w-sm p-4 bottom-0 pointer-events-none overflow-hidden">
      <div id="toast-container" className="flex flex-col gap-2 items-end justify-end h-full"></div>
    </div>,
    document.body,
  )
}

export const toast = {
  show: ({ title, description, type = "default", duration = 3000 }) => {
    const container = document.getElementById("toast-container")
    if (!container) return

    const toast = document.createElement("div")
    toast.className = `
      pointer-events-auto flex w-full items-center justify-between space-x-4 rounded-lg border p-4 shadow-md transition-all
      ${type === "success" ? "bg-green-600/20 border-green-600/30 text-green-200" : ""}
      ${type === "error" ? "bg-destructive/20 border-destructive/30 text-destructive-foreground" : ""}
      ${type === "warning" ? "bg-yellow-600/20 border-yellow-600/30 text-yellow-200" : ""}
      ${type === "default" ? "bg-secondary border-border text-secondary-foreground" : ""}
      animate-in slide-in-from-right-full
    `

    const iconMap = {
      success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
      error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`,
      warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>`,
      default: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>`,
    }

    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="shrink-0 self-center">
          ${iconMap[type]}
        </div>
        <div>
          ${title ? `<div class="font-medium">${title}</div>` : ""}
          ${description ? `<div class="text-sm opacity-90">${description}</div>` : ""}
        </div>
      </div>
      <button class="shrink-0 rounded-md p-1 transition-colors hover:bg-secondary">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `

    container.appendChild(toast)

    const closeButton = toast.querySelector("button")
    closeButton.addEventListener("click", () => {
      toast.classList.replace("animate-in", "animate-out")
      toast.classList.replace("slide-in-from-right-full", "slide-out-to-right-full")
      setTimeout(() => {
        container.removeChild(toast)
      }, 300)
    })

    setTimeout(() => {
      if (container.contains(toast)) {
        toast.classList.replace("animate-in", "animate-out")
        toast.classList.replace("slide-in-from-right-full", "slide-out-to-right-full")
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast)
          }
        }, 300)
      }
    }, duration)
  },
  success: (props) => toast.show({ ...props, type: "success" }),
  error: (props) => toast.show({ ...props, type: "error" }),
  warning: (props) => toast.show({ ...props, type: "warning" }),
}

