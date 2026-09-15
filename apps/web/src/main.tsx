import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tool } from "./components/Tool.tsx";

const mount = document.getElementById("tool");
if (mount) {
  mount.replaceChildren();
  createRoot(mount).render(
    <StrictMode>
      <Tool />
    </StrictMode>,
  );
}
