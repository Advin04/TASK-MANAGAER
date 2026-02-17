import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-dark-bg transition-colors duration-500">

      {/* Left Side - Animated Gradient & Branding */}
      <div className="hidden lg:flex relative items-center justify-center w-1/2 overflow-hidden bg-dark-bg">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary-500/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-xl px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
              Manage Projects <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400">
                Like a Pro
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Streamline your workflow, collaborate with your team, and track progress effortlessly with our essential project management tools.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-12 relative">
        {/* Background blobs for mobile/right side */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;