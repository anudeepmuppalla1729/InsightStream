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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const validateToken = useAuthStore((s) => s.validateToken);
  useEffect(() => {
    validateToken();
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/home" element={<Home />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
