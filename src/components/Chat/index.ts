import dynamic from "next/dynamic";

// skip SSR
export const Chat = dynamic(
  () => import("@/components/Chat/Chat").then((mod) => mod.Chat),
  {
    ssr: false,
  }
);
