import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-10 md:pt-0">

      {/* Gold accent strip (hidden on mobile) */}
      <div className="hidden md:block absolute left-0 top-0 h-full w-2 bg-gold-700"></div>

      {/* Centered card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{duration: 0.5, ease:"easeOut"}}
      >
      <div className="auth-card">
        <Outlet />
      </div>
      </motion.div>

    </div>
  );
};

export default AuthLayout;
