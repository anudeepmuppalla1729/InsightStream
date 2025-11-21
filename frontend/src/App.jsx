import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import AvatarSelectPage from "./pages/AvatarSelectionPage";

import ArticlePage from "./pages/ArticlePage";
import ReaderPanel from "./components/ReaderPanel";

import { useAuthStore } from "./store/useAuthStore";
import { useBookmarksStore } from "./store/useBookmarksStore";
import { useGuestBookmarksStore } from "./store/useGuestBookmarksStore";

function useBookmarksSyncOnConnectivity() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const flushQueue = useBookmarksStore((s) => s.flushQueue);
  const initForUser = useBookmarksStore((s) => s.initForUser);

  useEffect(() => {
    const onOnline = async () => {
      if (user?.id) {
        await initForUser(user.id, token);
        await flushQueue(token);
      }
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [user?.id, token]);
}

function App() {
  const validateToken = useAuthStore((s) => s.validateToken);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const initBookmarks = useBookmarksStore((s) => s.initForUser);

  useEffect(() => {
    validateToken();
  }, []);

  useEffect(() => {
    useGuestBookmarksStore.getState().load();
  }, []);

  useEffect(() => {
    if (user?.id) {
      initBookmarks(user.id, token);
    }
  }, [user?.id]);

  useBookmarksSyncOnConnectivity();

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/home" element={<Home />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/avatar" element={<AvatarSelectPage />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      {/* SIDE PANEL ALWAYS MOUNTED */}
      <ReaderPanel />
    </Router>
  );
}

export default App;
