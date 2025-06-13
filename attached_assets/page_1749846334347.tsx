"use client";
import dynamic from "next/dynamic";

const ChatSupportWidget = dynamic(
  () => import("./components/chatSupportWidget/page"),
  { ssr: false }
);

export default function WidgetPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <ChatSupportWidget />
    </div>
  );
}
