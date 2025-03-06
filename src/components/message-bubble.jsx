import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useState } from 'react';

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
  langPrefix: 'hljs language-'
});

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 bg-dark-700 hover:bg-dark-600 text-dark-200 px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="!mt-0 !mb-0">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const MessageBubble = ({ message, isLast }) => {
  const isUser = message.role === "user";

  const renderContent = (content) => {
    if (typeof content !== 'string') return '';
    
    try {
      // Custom renderer for code blocks
      const renderer = new marked.Renderer();
      renderer.code = (code, language) => {
        const highlightedCode = language && hljs.getLanguage(language)
          ? hljs.highlight(code, { language }).value
          : hljs.highlightAuto(code).value;

        return `<div class="code-block-wrapper relative group">
          <button class="copy-button absolute right-2 top-2 bg-dark-700 hover:bg-dark-600 text-dark-200 px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity" data-code="${encodeURIComponent(code)}">
            Copy
          </button>
          <pre class="!mt-0 !mb-0"><code class="hljs ${language || ''}">${highlightedCode}</code></pre>
        </div>`;
      };

      marked.setOptions({ renderer });
      const htmlContent = marked(content);

      const container = document.createElement('div');
      container.innerHTML = htmlContent;

      // Add click handlers for copy buttons after rendering
      setTimeout(() => {
        document.querySelectorAll('.copy-button').forEach(button => {
          if (!button.hasListener) {
            button.hasListener = true;
            button.addEventListener('click', async () => {
              const code = decodeURIComponent(button.dataset.code);
              await navigator.clipboard.writeText(code);
              const originalText = button.textContent;
              button.textContent = 'Copied!';
              setTimeout(() => {
                button.textContent = originalText;
              }, 2000);
            });
          }
        });
      }, 0);

      return (
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isLast && isUser ? "animate-appear" : ""}`}>
        <div className={`message-bubble ${isUser ? "user-message" : "assistant-message"}`}>
          {renderContent(message.content)}
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