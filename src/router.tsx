/**
 * 모듈: router.tsx
 * 경로: src/router.tsx
 * 목적: HashRouter 기반 라우팅 정의.
 */
import { createHashRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import ChecklistPage from "@/pages/ChecklistPage";
import WishlistPage from "@/pages/WishlistPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "checklist", element: <ChecklistPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
