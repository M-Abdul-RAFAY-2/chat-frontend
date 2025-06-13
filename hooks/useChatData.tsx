"use client";
import { useState, useEffect, useCallback } from "react";
import chatData from "../data/chatData.json";

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  avatar?: string;
  isSystem?: boolean;
  isPayment?: boolean;
  subtitle?: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  time: string;
  lastMessage: string;
  status: string | null;
  statusColor: string | null;
  unread: boolean;
  location: string;
  messages: Message[];
}

interface ChatDataContext {
  conversations: Conversation[];
  loading: boolean;
  addMessage: (conversationId: number, message: Message) => void;
  markAsRead: (conversationId: number) => void;
}

export function useChatData(): ChatDataContext {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/api/v1/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Transform backend data to frontend shape
        const mapped = data.map((conv: any) => ({
          id: conv._id,
          name: conv.customerId?.name || "Unknown",
          avatar:
            conv.customerId?.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase() || "U",
          time: conv.updatedAt || "",
          lastMessage: conv.lastMessage || "",
          status: conv.status || "",
          statusColor: conv.status === "NEW LEAD" ? "bg-orange-500" : "",
          unread: false,
          location: conv.customerId?.location || "",
          messages: [], // You can fetch messages separately if needed
        }));
        console.log("Mapped conversations:", mapped);
        setConversations(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addMessage = useCallback((conversationId: number, message: Message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              time: message.time,
              unread: false,
            }
          : conv
      )
    );
  }, []);

  const markAsRead = useCallback((conversationId: number) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: false } : conv
      )
    );
  }, []);

  return { conversations, loading, addMessage, markAsRead };
}
