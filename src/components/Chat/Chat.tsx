"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";

export function Chat() {
  return (
    <ThemeProvider mode="dark">
      <C1Chat apiUrl="/api/chat" />
    </ThemeProvider>
  );
}
