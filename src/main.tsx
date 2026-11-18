import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const clickjackable = window.top !== window;

if (import.meta.hot && !clickjackable) {
  void import("react-grab/core").then(({ init }) => {
    let snippet = "";
    init({ telemetry: false }).registerPlugin({
      name: "fire-routine",
      hooks: {
        transformCopyContent: (content) => (snippet = content),
        // react-grab 0.2.0 passes no hook the text typed in its comment box. That text
        // only shows up as a line in front of the snippet in the copied content.
        onCopySuccess: (_elements, content) => {
          if (content.endsWith(`\n${snippet}`)) import.meta.hot?.send("routine:fire", content);
        },
      },
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
