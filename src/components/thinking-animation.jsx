const ThinkingAnimation = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="thinking-bubble message-bubble flex items-center space-x-3 py-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: "600ms" }} />
          </div>
          <span className="text-sm text-muted-foreground">AI is thinking...</span>
        </div>
      </div>
    </div>
  )
}

export default ThinkingAnimation

