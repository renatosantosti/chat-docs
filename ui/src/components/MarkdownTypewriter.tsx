import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownTypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const MarkdownTypewriter: React.FC<MarkdownTypewriterProps> = ({
  text,
  speed = 25,
  onComplete,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className={`markdown-typewriter ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize styling for markdown elements
          p: ({ children }) => (
            <p className="mb-3 text-gray-800 leading-relaxed">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-gray-800">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-3">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-gray-300">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          ),
        }}
      >
        {displayedText}
      </ReactMarkdown>

      {/* Cursor */}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-gray-600 animate-pulse ml-1"></span>
      )}
    </div>
  );
};

export default MarkdownTypewriter;
