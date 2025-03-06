import { useState, useRef, useEffect } from "react";
import ChatHeader from "./components/chat-header";
import MessageBubble from "./components/message-bubble";
import ThinkingAnimation from "./components/thinking-animation";
import ChatInput from "./components/chat-input";
import "./index.css";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_KEY = import.meta.env.VITE_V1_API;

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Add dark mode class to the HTML element
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const sendMessage = async (inputText) => {
  if (!inputText.trim()) return;

  const userMessage = {
    role: "user",
    content: inputText,
    timestamp: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [...messages, { role: "user", content: inputText }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.choices[0]?.message;

    if (botReply) {
      setMessages((prev) => [
        ...prev,
        {
          ...botReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-950 p-4">
      <div className="w-full max-w-4xl bg-dark-900 rounded-lg shadow-xl border border-dark-800 flex flex-col h-[85vh]">
        <ChatHeader />

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-dark-400">
              <svg
                className="w-16 h-16 mb-4 text-blue-500"
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
              <p className="text-center font-medium">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} isLast={index === messages.length - 1} />
              ))}
              {isLoading && <ThinkingAnimation />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatApp;