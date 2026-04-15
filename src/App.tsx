/**
 * 모듈: App.tsx
 * 경로: src/App.tsx
 * 목적: 라우터 프로바이더 루트.
 */
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
