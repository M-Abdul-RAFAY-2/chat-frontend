"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Conversation, useChatData } from "../hooks/useChatData";

interface ChatViewProps {
  conversation: Conversation | null;
  onBack: () => void;
}

const ChatView = ({ conversation, onBack }: ChatViewProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, markAsRead } = useChatData();

  useEffect(() => {
    if (conversation && conversation.unread) {
      markAsRead(conversation.id);
    }
  }, [conversation, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && conversation) {
      addMessage(conversation.id, {
        sender: "agent",
        content: message.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "B",
      });
      setMessage("");
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 min-h-0">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No conversation selected
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Choose a conversation from the list to start messaging with your
            customers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0 h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-3 border-b border-gray-200 bg-white shadow-sm flex items-center">
        <button
          onClick={onBack}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ml-2">
          <span className="text-white font-semibold text-xs sm:text-sm">
            {conversation.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate ml-4">
          {conversation.name}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 bg-gray-50 min-h-0">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "agent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-sm ${
                msg.sender === "agent" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-xl shadow-sm ${
                  msg.sender === "agent"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.content || ""}
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-300">
                  <span className="text-xs font-medium text-white">
                    {msg.avatar ||
                      (msg.sender === "agent"
                        ? "B"
                        : conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join(""))}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{msg.time || ""}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-3 sm:px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed text-black"
              style={{ minHeight: "36px", maxHeight: "100px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-3 py-2 m-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors font-medium text-sm"
          >
            <span className="hidden sm:inline">Send</span>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
