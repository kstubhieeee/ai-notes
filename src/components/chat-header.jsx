const ChatHeader = () => {
  return (
    <div className="bg-dark-900 border-b border-dark-800 p-4 rounded-t-lg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          AI
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-semibold text-dark-50">AI Assistant</h1>
          <p className="text-sm text-dark-400">Kaustubh</p>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader