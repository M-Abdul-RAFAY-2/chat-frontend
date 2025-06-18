"use client";

import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import Inbox from "@/components/Inbox";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("inbox");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <TopNavigation onNavChange={setActivePage} activeItem={activePage} />
      {activePage === "inbox" ? (
        <Inbox />
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          This section is under development.
        </div>
      )}
    </div>
  );
}
