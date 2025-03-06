import { formatDistanceToNow } from "../utils/date-utils"

const MessageBubble = ({ message, isLast }) => {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isLast && isUser ? "animate-appear" : ""}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser ? "bg-indigo-600 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-right" : "text-left"} text-gray-500`}>
            {formatDistanceToNow(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  )
}

export default MessageBubble

