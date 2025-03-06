const ThinkingAnimation = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <div className="thinking-bubble message-bubble">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThinkingAnimation