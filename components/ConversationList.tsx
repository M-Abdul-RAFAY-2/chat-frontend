"use client";

import { Search, Filter, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ConversationListProps {
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  collapsed: boolean;
}

interface Conversation {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  status: "open" | "closed";
  leadStatus: string;
  avatar: string;
  unread?: boolean;
}

export default function ConversationList({
  selectedConversation,
  onSelectConversation,
  collapsed,
}: ConversationListProps) {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [searchQuery, setSearchQuery] = useState("");

  const conversations: Conversation[] = [
    {
      id: "james-thanks",
      customerName: "James",
      lastMessage: "You: Hi James! Thanks for reaching out to...",
      timestamp: "5 min ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "J",
    },
    {
      id: "frankie-villa",
      customerName: "Frankie Villa",
      lastMessage: "You: Sounds good! We definitely have what...",
      timestamp: "6 min ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "FV",
    },
    {
      id: "lisa-bartemi",
      customerName: "Lisa Bartemi",
      lastMessage: "Amazing! It looks so sleek. I'd love to stop in...",
      timestamp: "11 min ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "LB",
    },
    {
      id: "cam-yahway",
      customerName: "Cam Yahway",
      lastMessage: "You: $99 Payment Request",
      timestamp: "24 min ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "CY",
    },
    {
      id: "will-pantente",
      customerName: "Will Pantente",
      lastMessage: "You: Of course! Those are the best for car...",
      timestamp: "31 min ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "WP",
      unread: true,
    },
    {
      id: "samantha-price",
      customerName: "Samantha Price",
      lastMessage: "You: Hey there, Samantha! Sorry we missed...",
      timestamp: "1 hr ago",
      status: "open",
      leadStatus: "NEW LEAD",
      avatar: "SP",
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.status === activeTab &&
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-full",
        collapsed ? "w-0 overflow-hidden lg:w-64" : "w-full lg:w-64"
      )}
    >
      {/* Header - Fixed */}
      <div className="px-3 py-2 border-b border-gray-200 bg-white flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          All Conversations
        </h2>

        {/* Search */}
        <div className="relative mb-2">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={12} />
            <span>Filters</span>
            <ChevronDown size={12} />
          </button>
          <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Clock size={12} />
            <span>Newest</span>
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Tabs - Fixed */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => setActiveTab("open")}
          className={cn(
            "flex-1 px-2 py-2 text-xs font-medium transition-colors",
            activeTab === "open"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          OPEN
        </button>
        <button
          onClick={() => setActiveTab("closed")}
          className={cn(
            "flex-1 px-2 py-2 text-xs font-medium transition-colors",
            activeTab === "closed"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          CLOSED
        </button>
      </div>

      {/* Conversation List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "px-3 py-2 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50",
              selectedConversation === conversation.id &&
                "bg-blue-50 border-blue-200"
            )}
          >
            <div className="flex items-start space-x-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0",
                  conversation.id === "will-pantente"
                    ? "bg-pink-500"
                    : conversation.id === "cam-yahway"
                    ? "bg-orange-500"
                    : "bg-gray-500"
                )}
              >
                {conversation.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-xs font-medium text-gray-900 truncate">
                    {conversation.customerName}
                  </h3>
                  <span className="text-[10px] text-gray-500 flex-shrink-0">
                    {conversation.timestamp}
                  </span>
                </div>

                <p className="text-xs text-gray-600 truncate mb-1">
                  {conversation.lastMessage}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                    {conversation.leadStatus}
                  </span>
                  {conversation.unread && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}