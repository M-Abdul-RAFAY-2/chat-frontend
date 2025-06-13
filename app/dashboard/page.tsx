
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import ConversationsList from "../../components/ConversationsList";
import ChatView from "../../components/ChatView";
import BusinessInfoForm from "../../components/BusinessInfoForm";
import CampaignsForm from "../../components/CampaignsForm";
import TemplatesForm from "../../components/TemplatesForm";
import RulesForm from "../../components/RulesForm";
import IntegrationsForm from "../../components/IntegrationsForm";
import { Conversation } from "../../hooks/useChatData";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationsOpen, setConversationsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "business":
        return <BusinessInfoForm />;
      case "campaigns":
        return <CampaignsForm />;
      case "templates":
        return <TemplatesForm />;
      case "rules":
        return <RulesForm />;
      case "integrations":
        return <IntegrationsForm />;
      case "chat":
      default:
        return (
          <div className="flex-1 flex overflow-hidden relative min-h-0">
            {/* Conversations List */}
            <div
              className={`
                ${
                  conversationsOpen && !selectedConversation
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
                lg:translate-x-0 lg:relative lg:flex-shrink-0
                fixed inset-y-0 left-0 z-30 w-full sm:w-80 lg:w-80 top-0
                transition-transform duration-300 ease-in-out
                lg:transition-none
              `}
            >
              <ConversationsList
                onSelectConversation={(conv) => {
                  setSelectedConversation(conv);
                  setConversationsOpen(false);
                }}
                selectedConversation={selectedConversation}
                onClose={() => setConversationsOpen(false)}
                activeFilter="all"
              />
            </div>

            {/* Overlay for mobile */}
            {conversationsOpen && !selectedConversation && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={() => setConversationsOpen(false)}
              />
            )}

            {/* Chat View */}
            <div
              className={`
                flex-1 min-w-0 overflow-hidden
                ${selectedConversation ? "flex" : "hidden"}
                lg:flex
              `}
            >
              <ChatView
                conversation={selectedConversation}
                onBack={() => {
                  setSelectedConversation(null);
                  setConversationsOpen(true);
                }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
