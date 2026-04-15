/**
 * 모듈: router.tsx
 * 경로: src/router.tsx
 * 목적: HashRouter 기반 라우팅 정의.
 */
import { createHashRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import PresetsPage from "@/pages/PresetsPage";
import ChecklistPage from "@/pages/ChecklistPage";
import WishlistPage from "@/pages/WishlistPage";
import TipsPage from "@/pages/TipsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "presets", element: <PresetsPage /> },
      { path: "checklist", element: <ChecklistPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "tips", element: <TipsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
