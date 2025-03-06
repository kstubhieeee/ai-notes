import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const MessageBubble = ({ message, isLast }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isLast && isUser ? "animate-appear" : ""}`}>
        <div className={`message-bubble ${isUser ? "user-message" : "assistant-message"}`}>
          <ReactMarkdown
            className="prose prose-invert max-w-none"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md bg-dark-800 p-4 my-4"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-dark-800 rounded px-1 py-0.5" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.timestamp && (
          <p className={`text-xs mt-1 ${isUser ? "text-right" : "text-left"} text-dark-400`}>
            {new Date(message.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;