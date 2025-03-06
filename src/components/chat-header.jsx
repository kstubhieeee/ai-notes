const ChatHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          AI
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
          
        </div>
      </div>
    </div>
  )
}

export default ChatHeader

