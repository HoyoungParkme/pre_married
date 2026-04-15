/**
 * 모듈: main.tsx
 * 경로: src/main.tsx
 * 목적: React 앱 진입점. App을 root에 마운트한다.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("#root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
