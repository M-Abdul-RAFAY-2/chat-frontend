"use client";

import {
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  conversationId: string;
  onToggleProfile: () => void;
  profileVisible: boolean;
}

interface Message {
  id: string;
  sender: "customer" | "agent";
  content: string;
  timestamp: string;
  avatar?: string;
}

export default function ChatInterface({
  conversationId,
  onToggleProfile,
  profileVisible,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "customer",
      content: "Hey there! What family car models do you carry?",
      timestamp: "10:42 AM",
      avatar: "WP",
    },
    {
      id: "2",
      sender: "agent",
      content:
        "Hi Will! We have quite a few that are perfect for families. How many seats do you need?",
      timestamp: "10:42 AM",
      avatar: "FK",
    },
    {
      id: "3",
      sender: "customer",
      content:
        "Great! I need at least 6 seats, and I was hoping they'd have those screens for the backseat.",
      timestamp: "10:44 AM",
      avatar: "WP",
    },
    {
      id: "4",
      sender: "agent",
      content: "Of course! Those are the best for car rides",
      timestamp: "10:45 AM",
      avatar: "FK",
    },
  ]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const customerName = "Will Pantente";
  const customerLocation = "Venture Auto ...";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileInfo = null;
    if (attachedFile) {
      const formData = new FormData();
      formData.append("file", attachedFile);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        fileInfo = await res.json();
      } catch (err) {
        fileInfo = { name: attachedFile.name, error: "Upload failed" };
      }
    }
    if (newMessage.trim() || fileInfo) {
      setMessages((prev) => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          sender: "agent",
          content:
            newMessage +
            (fileInfo
              ? ` [File: ${fileInfo.name || fileInfo.error || "Unknown"}]`
              : ""),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "FK",
        },
      ]);
      setNewMessage("");
      setAttachedFile(null);
    }
  };

  const handleAIGenerate = async () => {
    setLoadingAI(true);
    try {
      const lastCustomerMsg =
        [...messages].reverse().find((m) => m.sender === "customer")?.content ||
        "";
      const prompt = lastCustomerMsg || "Generate a helpful support reply.";
      const res = await fetch("/api/generate-ai-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.message) setNewMessage(data.message);
    } catch (err) {
      setNewMessage("Sorry, failed to generate AI message.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col bg-white flex-1 min-w-0 h-full">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 text-xs">
            WP
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 truncate text-sm">
              {customerName}
            </h2>
            <p className="text-xs text-gray-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 flex-shrink-0"></span>
              <span className="truncate">{customerLocation}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Video size={18} />
          </button>
          <button
            onClick={onToggleProfile}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              profileVisible
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
        <div className="text-center">
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
            This is the beginning of your email conversation.
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">Today at 10:42 AM</p>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-2",
              message.sender === "agent" && "flex-row-reverse space-x-reverse"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0",
                message.sender === "customer" ? "bg-pink-500" : "bg-blue-500"
              )}
            >
              {message.avatar}
            </div>
            <div
              className={cn(
                "max-w-xs lg:max-w-md px-3 py-1.5 rounded-2xl text-xs",
                message.sender === "customer"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-blue-500 text-white"
              )}
            >
              <p className="text-xs">{message.content}</p>
              <p
                className={cn(
                  "text-[10px] mt-0.5",
                  message.sender === "customer"
                    ? "text-gray-500"
                    : "text-blue-100"
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="px-2 py-2 border-t border-gray-200 bg-white flex-shrink-0">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            onClick={handleAttachClick}
          >
            <Paperclip size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {attachedFile && (
            <span className="ml-1 text-[11px] text-gray-600">
              {attachedFile.name}
            </span>
          )}

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-3 py-1.5 border text-black border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16 text-xs"
            />

            {/* AI Generate Button */}
            <button
              type="button"
              onClick={handleAIGenerate}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
              title="Generate with AI"
              disabled={loadingAI}
            >
              {loadingAI ? (
                <span className="animate-spin">🤖</span>
              ) : (
                <Sparkles size={14} />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={cn(
                "absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition-colors",
                newMessage.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400"
              )}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}