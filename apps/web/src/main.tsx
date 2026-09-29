import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tool } from "./components/Tool.tsx";
import { startAnalytics } from "./analytics.ts";

const mount = document.getElementById("tool");
if (mount) {
  mount.replaceChildren();
  createRoot(mount).render(
    <StrictMode>
      <Tool verdict={mount.dataset.verdict === "432" ? "432" : undefined} />
    </StrictMode>,
  );
}

startAnalytics().catch((error) => console.error("Analytics failed to start", error));
