"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function NavbarClientWrapper() {
  const [activeTab, setActiveTab] = useState("chat");
  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleLogout = () => {
    // You can add Clerk sign out logic here if needed
    window.location.href = "/";
  };
  return (
    <Navbar
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
    />
  );
}
