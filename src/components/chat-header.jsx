const ChatHeader = () => {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          AI
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Kaustubh</p>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader